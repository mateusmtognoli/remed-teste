import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Minus, Plus, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useMedications } from '../context/MedicationContext';

export default function Restock() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inventory, updateInventoryCount, userRole } = useMedications();
  const [quantity, setQuantity] = useState(30);

  const item = inventory.find(i => i.id === id);

  const handleConfirm = () => {
    if (id) {
      updateInventoryCount(id, quantity);
      navigate('/stock');
    }
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
              Como dispositivo emparelhado, o reabastecimento ou alteração de estoque deve ser realizado pelo seu cuidador principal (<strong>Reinaldo Joaquim</strong>) no celular dele.
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
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Repor Medicamento</h1>
        <p className="text-slate-500 font-medium">Gerencie seu estoque de saúde com precisão clínica.</p>
      </header>

      <div className="space-y-6">
        <div className="bg-slate-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center overflow-hidden border border-slate-200/50">
          <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-white relative p-4 flex items-center justify-center">
            <img 
              src="/img/foto_vitaminaD.png" 
              alt="Medication" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex-1 w-full text-center md:text-left">
            <span className="text-emerald-600 font-extrabold tracking-widest text-[10px] uppercase mb-1 block">Medicamento Selecionado</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">{item?.name || 'Medicamento'}</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">Suplemento essencial para manutenção da saúde óssea e sistema imunológico.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
          <div className="mb-10">
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Quantidade Recebida</label>
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <button 
                onClick={() => setQuantity(Math.max(0, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
              >
                <Minus size={24} />
              </button>
              <div className="flex flex-col items-center">
                <span className="text-4xl font-extrabold text-slate-900 tracking-tighter">{quantity}</span>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Unidades</span>
              </div>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 flex items-center justify-center bg-white rounded-xl text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>

          <div className="mb-10">
            <label className="block text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-4">Data de Validade (Novo Lote)</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/60" />
              <input 
                type="date"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-slate-700 focus:ring-2 focus:ring-emerald-500 font-medium" 
              />
            </div>
          </div>

          <button 
            onClick={handleConfirm}
            className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-[#10b981] text-white font-extrabold text-lg shadow-lg shadow-emerald-100 active:scale-[0.98] flex items-center justify-center gap-3 hover:brightness-110 transition-all font-manrope"
          >
            <CheckCircle size={24} />
            Confirmar Reposição
          </button>
        </div>
      </div>
    </Layout>
  );
}
