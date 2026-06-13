import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Package, Save } from 'lucide-react';
import { useMedications } from '../context/MedicationContext';

const PACKAGE_UNITS: Record<string, { label: string; suffix: string; step: number }> = {
  pill: { label: 'Quantidade Inicial', suffix: 'comprimidos', step: 1 },
  capsule: { label: 'Quantidade Inicial', suffix: 'cápsulas', step: 1 },
  liquid: { label: 'Volume Inicial', suffix: 'ml', step: 10 },
  injection: { label: 'Quantidade Inicial', suffix: 'ampolas', step: 1 },
};

export default function AddStockMedication() {
  const navigate = useNavigate();
  const { addInventoryItem, userRole, activeDependent } = useMedications();
  const responsavelName = activeDependent?.responsavelName || 'seu responsável';

  const [name, setName] = useState('');
  const [count, setCount] = useState(0);
  const [type, setType] = useState('pill');

  const handleSave = () => {
    if (!name) return alert('Insira o nome do item.');
    
    addInventoryItem({
      name,
      count,
      daysLeft: Math.round(count / 2), // Mock estimation
      type
    });
    
    navigate('/stock');
  };

  if (userRole === 'emparelhado') {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="bg-amber-50 p-4 rounded-full text-amber-600 animate-pulse border border-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Recurso Limitado</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
              Como dispositivo emparelhado, a inserção ou alteração de estoque deve ser realizada pelo seu cuidador principal (<strong>{responsavelName}</strong>) no celular dele.
            </p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl active:scale-95 transition-all shadow-md shadow-emerald-950/10"
          >
            Voltar ao Início
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8">
        <h2 className="font-bold text-3xl text-slate-900 leading-tight">Adicionar Medicamento</h2>
        <p className="text-slate-500 mt-2 font-medium">Cadastre novos medicamentos para controle de inventário.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-slate-100 rounded-[2rem] p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <Package className="text-emerald-600 w-6 h-6" />
            <h3 className="font-bold text-lg">Informações do Item</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block font-semibold text-sm ml-1 text-slate-700">Nome do Medicamento</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-emerald-500 font-medium" 
                placeholder="Ex: Paracetamol 500mg" 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-sm ml-1 text-slate-700">Tipo de Embalagem</label>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full appearance-none bg-white border-none rounded-2xl py-4 pl-5 pr-10 focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-700 cursor-pointer outline-none transition-all"
                  >
                    <option value="pill">Comprimidos</option>
                    <option value="capsule">Cápsulas</option>
                    <option value="liquid">Líquido</option>
                    <option value="injection">Injetável</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block font-semibold text-sm ml-1 text-slate-700">{PACKAGE_UNITS[type].label} ({PACKAGE_UNITS[type].suffix})</label>
                <div className="flex items-center gap-2 bg-white rounded-2xl p-2 border border-slate-200">
                  <button
                    onClick={() => setCount(Math.max(0, count - PACKAGE_UNITS[type].step))}
                    className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shrink-0"
                  >
                    <span className="text-xl">-</span>
                  </button>
                  <input
                    type="number"
                    value={count === 0 ? '' : count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="flex-1 w-0 text-center border-none bg-transparent font-bold text-xl focus:ring-0"
                  />
                  <button
                    onClick={() => setCount(count + PACKAGE_UNITS[type].step)}
                    className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shrink-0"
                  >
                    <span className="text-xl">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <button
          onClick={handleSave}
          className="w-full py-5 rounded-full bg-emerald-700 text-white font-extrabold text-lg shadow-xl shadow-emerald-100 active:scale-95 transition-all mt-4 hover:bg-emerald-800 flex items-center justify-center gap-3"
        >
          <Save size={20} />
          Cadastrar Medicamento
        </button>
      </div>
    </Layout>
  );
}
