import React, { createContext, useContext, useState } from 'react';

export type MedicationStatus = 'Pendente' | 'Tomada' | 'Atrasada' | 'Pulada';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  time: string;
  status: MedicationStatus;
  confirmTime?: string;
  category?: string;
  days: number[];
  dependentId?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  status: 'Crítico' | 'Alerta' | null;
  count: number;
  registeredAmount: number;
  daysLeft: number;
  bar: string;
  type: string;
  color: string;
}

export interface AdherenceStats {
  taken: number;
  total: number;
}

export type UserRole = 'dependente' | 'responsavel' | 'emparelhado';

export interface Dependent {
  id: string;
  name: string;
  img: string;
  pairingCode?: string;
  relationship?: string;
  phone?: string;
  bloodType?: string;
  height?: string;
  weight?: string;
  age?: string;
  healthInsurance?: string;
  conditions?: string;
  allergies?: string;
  responsavelName?: string;
}

interface MedicationContextType {
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'status'>) => void;
  updateStatus: (id: string, status: MedicationStatus) => void;
  removeMedication: (id: string) => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'status' | 'bar' | 'color' | 'registeredAmount'>) => void;
  updateInventoryCount: (id: string, quantity: number) => void;
  removeInventoryItem: (id: string) => void;
  adherenceStats: Record<string, AdherenceStats>;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeDependent: Dependent | null;
  setActiveDependent: (dep: Dependent | null) => void;
  dependents: Dependent[];
  addDependent: (dep: Omit<Dependent, 'id' | 'pairingCode'>) => Dependent;
  removeDependent: (id: string) => void;
  pairingCodes: Record<string, string>;
  pairDevice: (code: string) => { success: boolean; dependentName?: string; error?: string };
  unpairDevice: () => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

// ── Helpers ────────────────────────────────────────────────────────────────

// Extrai a quantidade numérica de um texto de dosagem (ex: "2 comprimidos" → 2)
function parseDosageQuantity(dosage: string): number {
  const match = dosage.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) return 1;
  return parseFloat(match[1].replace(',', '.')) || 1;
}

// Crítico quando o estoque atual cai para 10% ou menos do total já registrado
function inventoryStatus(count: number, registeredAmount: number): 'Crítico' | 'Alerta' | null {
  if (registeredAmount <= 0) return null;
  if (count <= registeredAmount * 0.1) return 'Crítico';
  if (count < registeredAmount * 0.3) return 'Alerta';
  return null;
}

function generatePairingCode(name: string): string {
  const prefix = name.trim().split(/\s+/)[0].toUpperCase().slice(0, 3).padEnd(3, 'X');
  const suffix = Math.floor(100 + Math.random() * 900).toString();
  return `${prefix}-${suffix}`;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}

// Índice global: código de emparelhamento → dados do dependente
// Não é escopado por usuário para que funcione entre dispositivos diferentes
const PAIRING_LOOKUP_KEY = 'remed_pairing_lookup';

function loadPairingLookup(): Record<string, Dependent> {
  return loadFromStorage<Record<string, Dependent>>(PAIRING_LOOKUP_KEY, {});
}

function savePairingLookup(lookup: Record<string, Dependent>) {
  localStorage.setItem(PAIRING_LOOKUP_KEY, JSON.stringify(lookup));
}

// ── Provider ───────────────────────────────────────────────────────────────

export function MedicationProvider({ children }: { children: React.ReactNode }) {
  // Chave única por usuário — garante isolamento entre contas
  const userKey = localStorage.getItem('remed_current_user') || 'default';
  const ROLE_KEY  = `remed_user_role_${userKey}`;
  const DEPS_KEY  = `remed_dependents_${userKey}`;
  const ADEP_KEY  = `remed_active_dep_${userKey}`;
  const MEDS_KEY  = `remed_medications_${userKey}`;
  const INV_KEY   = `remed_inventory_${userKey}`;
  const ADH_KEY   = `remed_adherence_${userKey}`;
  // Para emparelhado, lê/escreve medicamentos da conta do responsável
  const savedRole = localStorage.getItem(ROLE_KEY) as UserRole | null;
  const responsavelKey = localStorage.getItem('remed_responsavel_key');
  const MEDS_SYNC_KEY = savedRole === 'emparelhado' && responsavelKey
    ? `remed_medications_${responsavelKey}`
    : MEDS_KEY;

  const [userRole, setUserRoleState] = useState<UserRole>(
    () => (localStorage.getItem(ROLE_KEY) as UserRole) || 'responsavel'
  );

  const [dependents, setDependents] = useState<Dependent[]>(() => {
    const saved = loadFromStorage<Dependent[]>(DEPS_KEY, []);
    const responsavelName = localStorage.getItem('remed_user_name') || '';
    return responsavelName ? saved.map(d => ({ ...d, responsavelName })) : saved;
  });

  const [activeDependent, setActiveDependentState] = useState<Dependent | null>(() => {
    const savedId = localStorage.getItem(ADEP_KEY);
    if (!savedId) return null;
    const deps = loadFromStorage<Dependent[]>(DEPS_KEY, []);
    // Tenta na lista do usuário primeiro; senão consulta o índice global de emparelhamento
    const fromDeps = deps.find(d => d.id === savedId);
    if (fromDeps) return fromDeps;
    const lookup = loadPairingLookup();
    return Object.values(lookup).find(d => d.id === savedId) ?? null;
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem(ROLE_KEY, role);
  };

  const setActiveDependent = (dep: Dependent | null) => {
    setActiveDependentState(dep);
    if (dep) localStorage.setItem(ADEP_KEY, dep.id);
    else localStorage.removeItem(ADEP_KEY);
  };

  const addDependent = (dep: Omit<Dependent, 'id' | 'pairingCode'>): Dependent => {
    const newDep: Dependent = {
      ...dep,
      id: Math.random().toString(36).substring(2, 11),
      pairingCode: generatePairingCode(dep.name),
    };

    // Salva na lista escopada do usuário
    setDependents(prev => {
      const updated = [...prev, newDep];
      localStorage.setItem(DEPS_KEY, JSON.stringify(updated));
      return updated;
    });

    // Registra no índice global de emparelhamento
    if (newDep.pairingCode) {
      const lookup = loadPairingLookup();
      lookup[newDep.pairingCode] = newDep;
      savePairingLookup(lookup);
      // Guarda o userKey do responsável para que o emparelhado possa sincronizar medicamentos
      localStorage.setItem(`remed_pair_owner_${newDep.pairingCode}`, userKey);
    }

    return newDep;
  };

  const removeDependent = (id: string) => {
    setDependents(prev => {
      const dep = prev.find(d => d.id === id);
      const updated = prev.filter(d => d.id !== id);
      localStorage.setItem(DEPS_KEY, JSON.stringify(updated));

      // Remove do índice global
      if (dep?.pairingCode) {
        const lookup = loadPairingLookup();
        delete lookup[dep.pairingCode];
        savePairingLookup(lookup);
        localStorage.removeItem(`remed_pair_owner_${dep.pairingCode}`);
      }
      return updated;
    });
    if (activeDependent?.id === id) setActiveDependent(null);
  };

  const pairingCodes = Object.fromEntries(
    dependents.filter(d => d.pairingCode).map(d => [d.id, d.pairingCode!])
  );

  const pairDevice = (code: string) => {
    const cleanCode = code.trim().toUpperCase();

    // 1. Tenta na lista local do usuário (mesmo dispositivo)
    const entry = Object.entries(pairingCodes).find(([, c]) => c === cleanCode);
    if (entry) {
      const dep = dependents.find(d => d.id === entry[0]);
      if (dep) {
        localStorage.setItem('remed_responsavel_key', userKey);
        setUserRole('emparelhado');
        setActiveDependent(dep);
        return { success: true, dependentName: dep.name };
      }
    }

    // 2. Consulta o índice global (dispositivo diferente)
    const lookup = loadPairingLookup();
    const dep = lookup[cleanCode];
    if (dep) {
      const ownerKey = localStorage.getItem(`remed_pair_owner_${cleanCode}`) || 'default';
      localStorage.setItem('remed_responsavel_key', ownerKey);
      setUserRole('emparelhado');
      setActiveDependent(dep);
      return { success: true, dependentName: dep.name };
    }

    return { success: false, error: 'Código inválido ou não encontrado.' };
  };

  const unpairDevice = () => {
    setUserRole('responsavel');
    setActiveDependentState(dependents[0] ?? null);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(ADEP_KEY);
    localStorage.removeItem('remed_responsavel_key');
  };

  React.useEffect(() => {
    if (userRole === 'responsavel' && !activeDependent && dependents.length > 0) {
      setActiveDependentState(dependents[0]);
    }
  }, [userRole, activeDependent, dependents]);

  const [medications, setMedications] = useState<Medication[]>(() =>
    loadFromStorage<Medication[]>(MEDS_SYNC_KEY, [])
  );
  const [inventory, setInventory] = useState<InventoryItem[]>(() =>
    loadFromStorage<InventoryItem[]>(INV_KEY, []).map(item => ({
      ...item,
      registeredAmount: item.registeredAmount ?? item.count,
    }))
  );
  const [adherenceStats, setAdherenceStats] = useState<Record<string, AdherenceStats>>(() =>
    loadFromStorage<Record<string, AdherenceStats>>(ADH_KEY, {})
  );

  const addMedication = (med: Omit<Medication, 'id' | 'status'>) => {
    setMedications(prev => {
      const updated = [...prev, {
        ...med,
        id: Math.random().toString(36).substring(2, 11),
        status: 'Pendente' as MedicationStatus,
      }];
      localStorage.setItem(MEDS_SYNC_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateStatus = (id: string, status: MedicationStatus) => {
    let medBeforeUpdate: Medication | undefined;
    setMedications(prev => {
      const updated = prev.map(m => {
        if (m.id !== id) return m;
        medBeforeUpdate = m;
        return {
          ...m,
          status,
          confirmTime: status === 'Tomada' || status === 'Pulada'
            ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            : undefined,
        };
      });
      localStorage.setItem(MEDS_SYNC_KEY, JSON.stringify(updated));
      return updated;
    });

    // Ao confirmar a dose, subtrai a quantidade correspondente do estoque
    if (status === 'Tomada' && medBeforeUpdate && medBeforeUpdate.status !== 'Tomada') {
      const med = medBeforeUpdate;
      setInventory(prev => {
        const item = prev.find(i => i.name.trim().toLowerCase() === med.name.trim().toLowerCase());
        if (!item) return prev;
        const quantity = parseDosageQuantity(med.dosage);
        const newCount = Math.max(0, item.count - quantity);
        const status = inventoryStatus(newCount, item.registeredAmount);
        const updated = prev.map(i => i.id === item.id ? {
          ...i,
          count: newCount,
          status,
          bar: item.registeredAmount > 0 ? `${Math.min(100, (newCount / item.registeredAmount) * 100)}%` : '0%',
          color: status === 'Crítico' ? 'bg-red-500' : 'bg-emerald-500',
        } : i);
        localStorage.setItem(INV_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const removeMedication = (id: string) => {
    setMedications(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem(MEDS_SYNC_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'status' | 'bar' | 'color' | 'registeredAmount'>) => {
    setInventory(prev => {
      const registeredAmount = item.count;
      const status = inventoryStatus(item.count, registeredAmount);
      const updated = [...prev, {
        ...item,
        id: Math.random().toString(36).substring(2, 11),
        registeredAmount,
        status,
        bar: registeredAmount > 0 ? `${Math.min(100, (item.count / registeredAmount) * 100)}%` : '0%',
        color: status === 'Crítico' ? 'bg-red-500' : 'bg-emerald-500',
      }] as InventoryItem[];
      localStorage.setItem(INV_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateInventoryCount = (id: string, quantity: number) => {
    setInventory(prev => {
      const updated = prev.map(item => {
        if (item.id !== id) return item;
        const newCount = Math.max(0, item.count + quantity);
        // Reposições (quantidade positiva) aumentam o total registrado, usado como base para o alerta de estoque baixo
        const registeredAmount = quantity > 0 ? item.registeredAmount + quantity : item.registeredAmount;
        const status = inventoryStatus(newCount, registeredAmount);
        return {
          ...item,
          count: newCount,
          registeredAmount,
          status,
          bar: registeredAmount > 0 ? `${Math.min(100, (newCount / registeredAmount) * 100)}%` : '0%',
          color: status === 'Crítico' ? 'bg-red-500' : 'bg-emerald-500',
        };
      });
      localStorage.setItem(INV_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeInventoryItem = (id: string) => {
    setInventory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem(INV_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Reinicia o status das doses ('Tomada'/'Pulada' → 'Pendente') quando o dia muda
  React.useEffect(() => {
    const LAST_RESET_KEY = `remed_last_reset_${userKey}`;
    const checkDailyReset = () => {
      const today = new Date().toDateString();
      if (localStorage.getItem(LAST_RESET_KEY) === today) return;

      // Acumula a adesão do dia que está terminando antes de zerar os status
      const currentMeds = loadFromStorage<Medication[]>(MEDS_SYNC_KEY, []);
      const endingDay = (new Date().getDay() + 6) % 7;
      const stats = loadFromStorage<Record<string, AdherenceStats>>(ADH_KEY, {});
      currentMeds.forEach(m => {
        if (!m.dependentId || !m.days.includes(endingDay)) return;
        const stat = stats[m.dependentId] ?? { taken: 0, total: 0 };
        stat.total += 1;
        if (m.status === 'Tomada') stat.taken += 1;
        stats[m.dependentId] = stat;
      });
      localStorage.setItem(ADH_KEY, JSON.stringify(stats));
      setAdherenceStats(stats);

      setMedications(prev => {
        const updated = prev.map(m => ({
          ...m,
          status: 'Pendente' as MedicationStatus,
          confirmTime: undefined,
        }));
        localStorage.setItem(MEDS_SYNC_KEY, JSON.stringify(updated));
        return updated;
      });
      localStorage.setItem(LAST_RESET_KEY, today);
    };

    checkDailyReset();
    const interval = setInterval(checkDailyReset, 60_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Atualiza status para 'Atrasada' quando o horário agendado já passou
  React.useEffect(() => {
    const checkOverdue = () => {
      const now = new Date();
      const todayDay = now.getDay();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();

      setMedications(prev => {
        let changed = false;
        const updated = prev.map(m => {
          if (m.status !== 'Pendente') return m;
          if (!m.days.includes(todayDay)) return m;
          const [h, min] = m.time.split(':').map(Number);
          if (nowMinutes > h * 60 + min) {
            changed = true;
            return { ...m, status: 'Atrasada' as MedicationStatus };
          }
          return m;
        });
        if (changed) localStorage.setItem(MEDS_SYNC_KEY, JSON.stringify(updated));
        return changed ? updated : prev;
      });
    };

    checkOverdue();
    const interval = setInterval(checkOverdue, 60_000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MedicationContext.Provider value={{
      medications, addMedication, updateStatus, removeMedication,
      inventory, addInventoryItem, updateInventoryCount, removeInventoryItem,
      adherenceStats,
      userRole, setUserRole,
      activeDependent, setActiveDependent,
      dependents, addDependent, removeDependent,
      pairingCodes, pairDevice, unpairDevice,
    }}>
      {children}
    </MedicationContext.Provider>
  );
}

export function useMedications() {
  const context = useContext(MedicationContext);
  if (!context) throw new Error('useMedications must be used within MedicationProvider');
  return context;
}
