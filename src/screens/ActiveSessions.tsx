import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { UserCheck, Smartphone, Monitor, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function detectDevice(): { label: string; icon: React.ReactNode } {
  const ua = navigator.userAgent;
  if (/Mobile|Android|iPhone/i.test(ua)) {
    return { label: 'Smartphone', icon: <Smartphone size={20} /> };
  }
  return { label: 'Computador', icon: <Monitor size={20} /> };
}

export default function ActiveSessions() {
  const navigate = useNavigate();
  const [ended, setEnded] = useState(false);
  const device = detectDevice();

  const now = new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  return (
    <Layout>
      <main className="max-w-md mx-auto space-y-8 pb-10">
        <section className="pt-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
              <UserCheck size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Sessões Ativas</h2>
              <p className="text-slate-500 font-medium text-sm">Veja onde sua conta está conectada.</p>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {ended && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-2 text-emerald-700 font-bold text-sm"
            >
              <CheckCircle2 size={18} />
              Todas as outras sessões foram encerradas.
            </motion.div>
          )}
        </AnimatePresence>

        <section className="space-y-3">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600 shrink-0">
              {device.icon}
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-800">{device.label} (este dispositivo)</span>
                <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md tracking-tighter">ATUAL</span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Último acesso: {now}</p>
            </div>
          </div>
        </section>

        <button
          onClick={() => setEnded(true)}
          disabled={ended}
          className="w-full py-5 text-red-600 font-extrabold text-sm uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-colors disabled:opacity-50 disabled:pointer-events-none"
        >
          Encerrar Todas as Outras Sessões
        </button>

        <button
          onClick={() => navigate('/security')}
          className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl active:scale-[0.98] transition-all hover:bg-slate-50 outline-none"
        >
          Voltar
        </button>
      </main>
    </Layout>
  );
}
