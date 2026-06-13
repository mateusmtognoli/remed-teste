import React from 'react';
import Layout from '../components/Layout';
import { Bell, Pill, Moon, ShieldAlert, FileText, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export default function NotificationPreferences() {
  const [settings, setSettings] = React.useState({
    medications: true,
    stock: true,
    dailySummary: false,
    monthlyReport: true,
    adherence: true,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Layout>
      <main className="max-w-md mx-auto space-y-8 pb-10">
        <section className="pt-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
              <Bell size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Notificações</h2>
              <p className="text-slate-500 font-medium text-sm">Personalize como você recebe alertas.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 rounded-[2.5rem] p-4 space-y-2">
          <div className="p-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Alertas de Saúde</h3>
            <div className="space-y-4">
              <PreferenceToggle 
                icon={<Pill size={18} />} 
                title="Medicamentos" 
                active={settings.medications} 
                onClick={() => toggle('medications')}
              />
              <PreferenceToggle 
                icon={<ShieldAlert size={18} />} 
                title="Baixo Estoque" 
                active={settings.stock} 
                onClick={() => toggle('stock')}
              />
              <PreferenceToggle
                icon={<Moon size={18} />}
                title="Resumo Diário"
                active={settings.dailySummary}
                onClick={() => toggle('dailySummary')}
              />
            </div>
          </div>

        </section>

        <section className="bg-slate-50 rounded-[2.5rem] p-4 space-y-2">
          <div className="p-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Alertas de Relatórios</h3>
            <div className="space-y-4">
              <PreferenceToggle
                icon={<FileText size={18} />}
                title="Relatório Mensal"
                active={settings.monthlyReport}
                onClick={() => toggle('monthlyReport')}
              />
              <PreferenceToggle
                icon={<TrendingUp size={18} />}
                title="Adesão ao Tratamento"
                active={settings.adherence}
                onClick={() => toggle('adherence')}
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

function PreferenceToggle({ icon, title, desc, active, onClick }: { icon: React.ReactNode, title: string, desc?: string, active: boolean, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between group cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
          {icon}
        </div>
        <div>
          <span className="font-extrabold text-sm text-slate-800 block">{title}</span>
          {desc && <span className="text-xs text-slate-400 font-medium">{desc}</span>}
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
        <motion.div 
          animate={{ x: active ? 26 : 4 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </div>
    </div>
  );
}
