import React from 'react';
import Layout from '../components/Layout';
import { Shield, Lock, Eye, Key, ChevronRight, UserCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function Security() {
  return (
    <Layout>
      <main className="max-w-md mx-auto space-y-8 pb-10">
        <section className="pt-6">
          <div className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <Shield size={40} className="mb-4 opacity-80" />
              <h2 className="text-3xl font-extrabold tracking-tight">Segurança e Privacidade</h2>
              <p className="text-emerald-100 font-medium text-sm mt-2">Proteja sua conta e controle seus dados.</p>
            </div>
            <div className="absolute -right-10 -bottom-10 bg-white/10 w-40 h-40 rounded-full blur-3xl" />
          </div>
        </section>

        <section className="space-y-4">
          <SecurityItem 
            icon={<Key size={20} />} 
            title="Alterar Senha" 
            desc="Atualize sua senha de acesso periodicamente."
          />
          <SecurityItem 
            icon={<Lock size={20} />} 
            title="Autenticação em Duas Etapas" 
            desc="Adicione uma camada extra de proteção."
            badge="RECOMENDADO"
          />
          <SecurityItem 
            icon={<UserCheck size={20} />} 
            title="Sessões Ativas" 
            desc="Veja onde sua conta está conectada."
          />
        </section>

        <section className="bg-slate-100 rounded-[2.5rem] p-8">
          <h3 className="text-xl font-extrabold text-slate-800 mb-6">Privacidade</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-extrabold text-slate-800">Compartilhar Dados de Uso</p>
                <p className="text-xs text-slate-500 font-medium">Ajude-nos a melhorar o aplicativo.</p>
              </div>
              <Toggle active={true} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-extrabold text-slate-800">Perfil Público</p>
                <p className="text-xs text-slate-500 font-medium">Outros cuidadores podem te encontrar.</p>
              </div>
              <Toggle active={false} />
            </div>
          </div>
        </section>

        <section>
          <button className="w-full py-5 text-red-600 font-extrabold text-sm uppercase tracking-widest hover:bg-red-50 rounded-2xl transition-colors">
            Excluir Minha Conta
          </button>
        </section>
      </main>
    </Layout>
  );
}

function SecurityItem({ icon, title, desc, badge }: { icon: React.ReactNode, title: string, desc: string, badge?: string }) {
  return (
    <button className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md active:scale-[0.99] transition-all group text-left">
      <div className="flex items-center gap-4">
        <div className="text-slate-700 bg-slate-50 p-2.5 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-slate-800">{title}</span>
            {badge && <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md tracking-tighter">{badge}</span>}
          </div>
          <p className="text-xs text-slate-400 font-medium">{desc}</p>
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

function Toggle({ active }: { active: boolean }) {
  return (
    <div className={`w-10 h-5 rounded-full relative transition-all ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}>
      <motion.div 
        animate={{ x: active ? 20 : 4 }}
        className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
      />
    </div>
  );
}
