import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Lock, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

export default function TwoFactorAuth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const STORAGE_KEY = `remed_2fa_${user?.email ?? 'default'}`;

  const [enabled, setEnabled] = useState(() => localStorage.getItem(STORAGE_KEY) === 'true');

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  return (
    <Layout>
      <main className="max-w-md mx-auto space-y-8 pb-10">
        <section className="pt-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
              <Lock size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Autenticação em Duas Etapas</h2>
              <p className="text-slate-500 font-medium text-sm">Adicione uma camada extra de proteção.</p>
            </div>
          </div>
        </section>

        <section className="bg-slate-50 rounded-[2.5rem] p-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-white p-2.5 rounded-xl shadow-sm text-emerald-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-extrabold text-sm text-slate-800">Verificação por e-mail</p>
                <p className="text-xs text-slate-400 font-medium">
                  {enabled ? 'Ativada — um código será enviado a cada novo login.' : 'Desativada'}
                </p>
              </div>
            </div>
            <div
              onClick={toggle}
              className={`w-12 h-6 rounded-full relative transition-all cursor-pointer shrink-0 ${enabled ? 'bg-emerald-500' : 'bg-slate-300'}`}
            >
              <motion.div
                animate={{ x: enabled ? 24 : 4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </div>
          </div>

          {enabled && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 text-emerald-700"
            >
              <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
              <p className="text-xs font-bold leading-relaxed">
                A partir de agora, sempre que você ou alguém tentar acessar sua conta a partir de um novo dispositivo,
                enviaremos um código de verificação para <strong>{user?.email}</strong>.
              </p>
            </motion.div>
          )}
        </section>

        <section className="bg-slate-100 rounded-[2.5rem] p-6 space-y-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-emerald-600" size={20} />
            <h3 className="font-extrabold text-slate-900">Por que ativar?</h3>
          </div>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            A autenticação em duas etapas dificulta o acesso indevido à sua conta, mesmo que alguém descubra sua senha.
            Recomendamos manter essa proteção ativada, principalmente por conter dados de saúde sensíveis dos seus dependentes.
          </p>
        </section>

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
