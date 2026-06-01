import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Bell, Pill, AlertTriangle, ShoppingCart, ChevronRight, History as HistoryIcon, User } from 'lucide-react';
import { motion } from 'motion/react';
import { useMedications } from '../context/MedicationContext';

export default function Notifications() {
  const navigate = useNavigate();
  const { medications, updateStatus } = useMedications();

  const handleTakeDose = () => {
    // Take the first pending medication as a demo
    const pending = medications.find(m => m.status === 'Pendente');
    if (pending) {
      updateStatus(pending.id, 'Tomada');
      alert(`Dose de ${pending.name} confirmada!`);
    } else {
      alert('Nenhuma dose pendente para tomar agora.');
    }
  };

  const handleSkipDose = () => {
    const pending = medications.find(m => m.status === 'Pendente');
    if (pending) {
      updateStatus(pending.id, 'Pulada');
      alert(`Dose de ${pending.name} pulada.`);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-slate-900 font-extrabold text-3xl tracking-tight mb-2">Notificações</h2>
        <p className="text-slate-500 font-medium text-sm">Acompanhe seu histórico de saúde e alertas importantes.</p>
      </div>

      <div className="space-y-8">
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-slate-900 font-extrabold text-lg">Hoje</h3>
            <span className="text-emerald-600 font-extrabold text-[10px] tracking-widest uppercase">4 Novas</span>
          </div>
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 flex gap-4 transition-all hover:bg-emerald-50 active:scale-[0.98] cursor-pointer group shadow-sm border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 text-emerald-600">
                <Pill size={24} fill="currentColor" fillOpacity={0.1} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-slate-900 font-extrabold text-base leading-tight">Hora de tomar Vitamina D (2000UI)</p>
                  <span className="text-slate-400 font-bold text-[11px] whitespace-nowrap ml-2">Agora</span>
                </div>
                <p className="text-slate-500 font-medium text-sm leading-snug">Lembrete de rotina configurado para às 09:00 AM.</p>
                <div className="mt-3 flex gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleTakeDose(); }}
                    className="bg-emerald-600 text-white font-extrabold text-[11px] px-5 py-2.5 rounded-xl active:scale-95 transition-all shadow-sm"
                  >
                    Tomar Dose
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSkipDose(); }}
                    className="bg-slate-100 text-slate-600 font-extrabold text-[11px] px-5 py-2.5 rounded-xl active:scale-95 transition-all border border-slate-200"
                  >
                    Adiar
                  </button>
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/stock')}
              className="bg-white rounded-2xl p-4 flex gap-4 transition-all hover:bg-red-50 active:scale-[0.98] cursor-pointer shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 text-red-500">
                <AlertTriangle size={24} fill="currentColor" fillOpacity={0.1} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-slate-900 font-extrabold text-base leading-tight">Estoque Crítico</p>
                  <span className="text-slate-400 font-bold text-[11px] whitespace-nowrap ml-2">2h atrás</span>
                </div>
                <p className="text-slate-500 font-medium text-sm">Atenção: O estoque de Amoxicilina está acabando (3 doses restantes).</p>
                <div className="mt-2 flex items-center text-emerald-700 font-extrabold text-[11px] gap-1.5 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                  <ShoppingCart size={14} />
                  <span>Comprar agora</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-slate-900 font-extrabold text-lg">Ontem</h3>
          </div>
          <div className="space-y-3">
            <div 
              onClick={() => navigate('/history')}
              className="bg-white rounded-2xl p-4 flex gap-4 transition-all hover:bg-slate-50 active:scale-[0.98] cursor-pointer shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 overflow-hidden border border-emerald-100">
                <img 
                  src="/img/foto_medica.png" 
                  alt="Doc" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-slate-900 font-extrabold text-base leading-tight">Dra. Joana Mello</p>
                  <span className="text-slate-400 font-bold text-[11px] whitespace-nowrap ml-2">Ontem</span>
                </div>
                <p className="text-slate-500 font-medium text-sm">Dra. Joana Mello visualizou seu relatório de adesão semanal.</p>
                <div className="mt-2 text-emerald-700 font-extrabold text-[10px] uppercase tracking-widest flex items-center gap-1">
                  Ver Detalhes do Relatório <ChevronRight size={12} />
                </div>
              </div>
            </div>

            <div 
              onClick={() => navigate('/history')}
              className="bg-white rounded-2xl p-4 flex gap-4 opacity-60 transition-all hover:bg-slate-50 active:scale-[0.98] cursor-pointer shadow-sm border border-slate-100 italic"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-400">
                <HistoryIcon size={24} />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-red-500 font-extrabold text-base leading-tight">Dose atrasada</p>
                  <span className="text-slate-400 font-bold text-[11px] whitespace-nowrap ml-2">18:00</span>
                </div>
                <p className="text-slate-500 font-medium text-sm">Losartana 50mg às 08:00 AM não foi registrada.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
