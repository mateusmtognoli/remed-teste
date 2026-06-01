import React from 'react';
import Layout from '../components/Layout';
import { CreditCard, Check, ShieldCheck, Zap, Star } from 'lucide-react';
import { motion } from 'motion/react';

function getExpiryDate() {
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  return expiry.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function Subscription() {
  const expiryDate = getExpiryDate();
  return (
    <Layout>
      <main className="max-w-md mx-auto space-y-8 pb-10">
        <section className="pt-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <Star className="text-yellow-400 fill-yellow-400" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-400">Plano Premium</span>
              </div>
              <h2 className="text-4xl font-extrabold tracking-tight">Ativo e Protegido.</h2>
              <p className="text-slate-400 font-medium text-sm mt-2">Sua assinatura vence em {expiryDate}.</p>
            </div>
            <Zap className="absolute -right-4 -top-4 text-emerald-500/10 w-48 h-48" />
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xl font-extrabold text-slate-800 ml-2">Sua Assinatura</h3>
          <div className="bg-white border-2 border-emerald-500 rounded-3xl p-6 shadow-xl shadow-emerald-500/10 relative">
            <div className="absolute -top-3 right-6 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full">ESTA CONTA</div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-2xl font-extrabold text-slate-900">Plano Familiar</h4>
                <p className="text-sm text-slate-500 font-medium italic">Até 5 dependentes e cuidadores ilimitados</p>
              </div>
              <p className="text-xl font-extrabold text-emerald-600">R$ 29,90<span className="text-xs text-slate-400">/mês</span></p>
            </div>
            <ul className="space-y-3">
              <PlanFeature text="Histórico ilimitado e exportação em PDF" />
              <PlanFeature text="Alertas via SMS e WhatsApp para emergências" />
              <PlanFeature text="Gerenciamento avançado de estoque" />
              <PlanFeature text="Suporte prioritário 24/7" />
            </ul>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center ml-2">
            <h3 className="text-xl font-extrabold text-slate-800">Método de Pagamento</h3>
            <button className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest hover:underline">Alterar</button>
          </div>
          <div className="bg-slate-100 p-6 rounded-3xl flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl shadow-sm">
              <CreditCard className="text-slate-700" size={24} />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">Visa final • • • • 4432</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Expira em 10/28</p>
            </div>
          </div>
        </section>

        <section className="pt-4">
          <button className="w-full py-5 text-slate-400 font-extrabold text-sm uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-colors">
            Cancelar Assinatura
          </button>
        </section>
      </main>
    </Layout>
  );
}

function PlanFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <div className="bg-emerald-100 p-1 rounded-full text-emerald-600">
        <Check size={12} strokeWidth={4} />
      </div>
      <span className="text-sm font-bold text-slate-700">{text}</span>
    </li>
  );
}
