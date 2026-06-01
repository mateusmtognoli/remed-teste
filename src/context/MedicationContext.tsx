import React, { createContext, useContext, useState } from 'react';

export type MedicationStatus = 'Pendente' | 'Tomada' | 'Atrasada' | 'Pulada';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  time: string; // "HH:MM"
  status: MedicationStatus;
  confirmTime?: string;
  category?: string;
  days: number[]; // 0-6 for Sun-Sat
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
}

interface MedicationContextType {
  medications: Medication[];
  addMedication: (med: Omit<Medication, 'id' | 'status'>) => void;
  updateStatus: (id: string, status: MedicationStatus) => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'status' | 'bar' | 'color'>) => void;
  updateInventoryCount: (id: string, quantity: number) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeDependent: Dependent | null;
  setActiveDependent: (dep: Dependent | null) => void;
  dependents: Dependent[];
  pairingCodes: Record<string, string>;
  pairDevice: (code: string) => { success: boolean; dependentName?: string; error?: string };
  unpairDevice: () => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export function MedicationProvider({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>(() => {
    return (localStorage.getItem('remed_user_role') as UserRole) || 'responsavel';
  });
  const [dependents] = useState<Dependent[]>([
    { id: '1', name: 'Teresinha Andrade', img: '/img/foto_teresinha.png' },
    { id: '2', name: 'Antônio Andrade', img: '/img/foto_antonio.png' }
  ]);
  const [activeDependent, setActiveDependentState] = useState<Dependent | null>(() => {
    const savedId = localStorage.getItem('remed_active_dependent_id');
    if (savedId) {
      const found = [
        { id: '1', name: 'Teresinha Andrade', img: '/img/foto_teresinha.png' },
        { id: '2', name: 'Antônio Andrade', img: '/img/foto_antonio.png' }
      ].find(d => d.id === savedId);
      if (found) return found;
    }
    return null;
  });

  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('remed_user_role', role);
  };

  const setActiveDependent = (dep: Dependent | null) => {
    setActiveDependentState(dep);
    if (dep) {
      localStorage.setItem('remed_active_dependent_id', dep.id);
    } else {
      localStorage.removeItem('remed_active_dependent_id');
    }
  };

  const pairingCodes: Record<string, string> = {
    '1': 'TER-482',
    '2': 'ANT-753'
  };

  const pairDevice = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const foundEntry = Object.entries(pairingCodes).find(([id, c]) => c === cleanCode);
    if (foundEntry) {
      const depId = foundEntry[0];
      const dependent = dependents.find(d => d.id === depId);
      if (dependent) {
        setUserRole('emparelhado');
        setActiveDependent(dependent);
        return { success: true, dependentName: dependent.name };
      }
    }
    return { success: false, error: 'Código inválido ou não encontrado.' };
  };

  const unpairDevice = () => {
    setUserRole('responsavel');
    setActiveDependent(dependents[0]);
    localStorage.removeItem('remed_user_role');
    localStorage.removeItem('remed_active_dependent_id');
  };

  React.useEffect(() => {
    if (userRole === 'responsavel' && !activeDependent) {
      setActiveDependentState(dependents.find(d => d.name === 'Antônio Andrade') || dependents[0]);
    } else if (userRole === 'emparelhado' && !activeDependent) {
      setActiveDependentState(dependents.find(d => d.id === '2') || dependents[0]);
    } else if (userRole === 'dependente') {
      setUserRole('emparelhado');
      setActiveDependentState(dependents.find(d => d.id === '2') || dependents[0]);
    }
  }, [userRole, activeDependent, dependents]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Vitamina D 2000UI', status: 'Crítico', count: 4, daysLeft: 2, bar: '25%', type: 'medication', color: 'bg-red-500' },
    { id: '2', name: 'Amoxicilina 500mg', status: 'Alerta', count: 28, daysLeft: 14, bar: '45%', type: 'pill', color: 'bg-emerald-500' },
    { id: '3', name: 'Ômega 3 1000mg', status: null, count: 60, daysLeft: 60, bar: '95%', type: 'vaccines', color: 'bg-emerald-700' },
  ]);

  const [medications, setMedications] = useState<Medication[]>([
    // Teresinha's Medications (ID 1)
    {
      id: '2',
      name: 'Losartana 50mg',
      dosage: '1 comprimido',
      instructions: 'Em jejum',
      time: '07:00',
      status: 'Tomada',
      confirmTime: '07:12',
      category: 'Anti-hipertensivo',
      days: [0, 1, 2, 3, 4, 5, 6],
      dependentId: '1'
    },
    {
      id: '3',
      name: 'Metformina 850mg',
      dosage: '1 comprimido',
      instructions: 'Após o jantar',
      time: '20:00',
      status: 'Pendente',
      category: 'Antidiabético',
      days: [0, 1, 2, 3, 4, 5, 6],
      dependentId: '1'
    },
    // Antônio's Medications (ID 2) - This will be the set for the "Dependente" view
    {
      id: '4',
      name: 'Vitamina D 2000UI',
      dosage: '1 cápsula',
      instructions: 'Tomar pela manhã',
      time: '08:00',
      status: 'Tomada',
      confirmTime: '08:10',
      category: 'Suplemento',
      days: [0, 1, 2, 3, 4, 5, 6],
      dependentId: '2'
    },
    {
      id: '5',
      name: 'Amoxicilina 500mg',
      dosage: '1 cápsula',
      instructions: 'De 8 em 8 horas',
      time: '14:00',
      status: 'Atrasada',
      category: 'Antibiótico',
      days: [0, 1, 2, 3, 4, 5, 6],
      dependentId: '2'
    },
    {
      id: '6',
      name: 'Dipirona 500mg',
      dosage: '20 gotas',
      instructions: 'Se houver febre ou dor',
      time: '22:00',
      status: 'Pendente',
      category: 'Analgésico',
      days: [0, 1, 2, 3, 4, 5, 6],
      dependentId: '2'
    }
  ]);

  const addMedication = (med: Omit<Medication, 'id' | 'status'>) => {
    const newMed: Medication = {
      ...med,
      id: Math.random().toString(36).substr(2, 9),
      status: 'Pendente'
    };
    setMedications(prev => [...prev, newMed]);
  };

  const updateStatus = (id: string, status: MedicationStatus) => {
    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        const confirmTime = status === 'Tomada' ? new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : undefined;
        return { ...m, status, confirmTime };
      }
      return m;
    }));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'status' | 'bar' | 'color'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      status: item.count < 10 ? 'Crítico' : (item.count < 30 ? 'Alerta' : null),
      bar: `${Math.min(100, (item.count / 60) * 100)}%`,
      color: item.count < 10 ? 'bg-red-500' : 'bg-emerald-500'
    };
    setInventory(prev => [...prev, newItem]);
  };

  const updateInventoryCount = (id: string, quantity: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === id) {
        const newCount = item.count + quantity;
        return {
          ...item,
          count: newCount,
          status: newCount < 10 ? 'Crítico' : (newCount < 30 ? 'Alerta' : null),
          bar: `${Math.min(100, (newCount / 60) * 100)}%`,
          color: newCount < 10 ? 'bg-red-500' : 'bg-emerald-500'
        };
      }
      return item;
    }));
  };

  return (
    <MedicationContext.Provider value={{ 
      medications, 
      addMedication, 
      updateStatus,
      inventory,
      addInventoryItem,
      updateInventoryCount,
      userRole,
      setUserRole,
      activeDependent,
      setActiveDependent,
      dependents,
      pairingCodes,
      pairDevice,
      unpairDevice
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
