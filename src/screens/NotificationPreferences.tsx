import React from 'react';
import Layout from '../components/Layout';
import { Bell, Pill, Droplets, Calendar, MessageSquare, Volume2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function NotificationPreferences() {
  const [settings, setSettings] = React.useState({
    medications: true,
    stock: true,
    hydration: false,
    appointments: true,
    caregiverMsgs: true,
    emergency: true
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
                icon={<Droplets size={18} />} 
                title="Sincronizar Hidratação" 
                active={settings.hydration} 
                onClick={() => toggle('hydration')}
              />
            </div>
          </div>

          <div className="p-4 pt-0">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 mt-6">Sistema e Social</h3>
            <div className="space-y-4">
              <PreferenceToggle 
                icon={<Calendar size={18} />} 
                title="Agenda Médica" 
                active={settings.appointments} 
                onClick={() => toggle('appointments')}
              />
              <PreferenceToggle 
                icon={<MessageSquare size={18} />} 
                title="Mensagens de Cuidadores" 
                active={settings.caregiverMsgs} 
                onClick={() => toggle('caregiverMsgs')}
              />
              <PreferenceToggle 
                icon={<Volume2 size={18} />} 
                title="Alertas Críticos (Surg)" 
                active={settings.emergency} 
                onClick={() => toggle('emergency')}
              />
            </div>
          </div>
        </section>

        <section className="bg-emerald-600 rounded-3xl p-6 text-white text-center shadow-lg shadow-emerald-200">
          <p className="font-extrabold text-sm mb-4">Gostaria de silenciar tudo por um tempo?</p>
          <button className="w-full bg-emerald-950 text-white py-4 rounded-2xl font-extrabold shadow-sm active:scale-95 transition-all">
            Ativar Modo Foco (2h)
          </button>
        </section>
      </main>
    </Layout>
  );
}

function PreferenceToggle({ icon, title, active, onClick }: { icon: React.ReactNode, title: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between group cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-400'}`}>
          {icon}
        </div>
        <span className="font-extrabold text-sm text-slate-800">{title}</span>
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
