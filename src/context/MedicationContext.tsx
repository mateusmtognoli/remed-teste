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
  daysLeft: number;
  bar: string;
  type: string;
  color: string;
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
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'status' | 'bar' | 'color'>) => void;
  updateInventoryCount: (id: string, quantity: number) => void;
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
    loadFromStorage<InventoryItem[]>(INV_KEY, [])
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
    setMedications(prev => {
      const updated = prev.map(m => {
        if (m.id !== id) return m;
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
  };

  const removeMedication = (id: string) => {
    setMedications(prev => {
      const updated = prev.filter(m => m.id !== id);
      localStorage.setItem(MEDS_SYNC_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'status' | 'bar' | 'color'>) => {
    setInventory(prev => {
      const updated = [...prev, {
        ...item,
        id: Math.random().toString(36).substring(2, 11),
        status: item.count < 10 ? 'Crítico' : item.count < 30 ? 'Alerta' : null,
        bar: `${Math.min(100, (item.count / 60) * 100)}%`,
        color: item.count < 10 ? 'bg-red-500' : 'bg-emerald-500',
      }] as InventoryItem[];
      localStorage.setItem(INV_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateInventoryCount = (id: string, quantity: number) => {
    setInventory(prev => {
      const updated = prev.map(item => {
        if (item.id !== id) return item;
        const newCount = item.count + quantity;
        return {
          ...item,
          count: newCount,
          status: newCount < 10 ? 'Crítico' : newCount < 30 ? 'Alerta' : null,
          bar: `${Math.min(100, (newCount / 60) * 100)}%`,
          color: newCount < 10 ? 'bg-red-500' : 'bg-emerald-500',
        };
      });
      localStorage.setItem(INV_KEY, JSON.stringify(updated));
      return updated;
    });
  };

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
      inventory, addInventoryItem, updateInventoryCount,
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
