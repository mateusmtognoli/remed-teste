import React from 'react';
import Layout from '../components/Layout';
import { Users, UserPlus, Shield, MoreVertical, Search, Mail, Smartphone, Key, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useMedications } from '../context/MedicationContext';

export default function ManageAccess() {
  const navigate = useNavigate();
  const { dependents, pairingCodes } = useMedications();
  const [activeTab, setActiveTab] = React.useState<'users' | 'requests' | 'pairing'>('pairing');

  return (
    <Layout>
      <main className="max-w-md mx-auto space-y-8 pb-10">
        <section className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Gerenciar Acessos</h2>
              <p className="text-slate-500 font-medium text-sm">Controle quem pode visualizar seus dados.</p>
            </div>
            <button 
              onClick={() => navigate('/add-dependent')}
              className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg shadow-emerald-900/10 active:scale-95 transition-all hover:bg-emerald-700"
            >
              <UserPlus size={24} />
            </button>
          </div>

          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1">
            <button 
              onClick={() => setActiveTab('pairing')}
              className={`flex-1 py-3 rounded-xl text-xs font-extrabold tracking-widest uppercase transition-all ${activeTab === 'pairing' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
            >
              Emparelhar Celular
            </button>
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-3 rounded-xl text-xs font-extrabold tracking-widest uppercase transition-all ${activeTab === 'users' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
            >
              Cuidadores
            </button>
            <button 
              onClick={() => setActiveTab('requests')}
              className={`flex-1 py-3 rounded-xl text-xs font-extrabold tracking-widest uppercase transition-all ${activeTab === 'requests' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:bg-white/50'}`}
            >
              Solicitações
            </button>
          </div>
        </section>

        <section className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'pairing' ? (
              <motion.div 
                key="pairing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-3xl flex items-start gap-4">
                  <div className="bg-emerald-100 text-emerald-700 p-2.5 rounded-xl shrink-0 mt-0.5">
                    <Smartphone size={20} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-emerald-900 text-sm">Como emparelhar?</h3>
                    <p className="text-emerald-800/80 text-xs font-medium leading-relaxed">
                      Instale o ReMed no celular do seu dependente. Ao abrir o aplicativo, clique em <strong>"Emparelhar Celular (Dependente)"</strong> e utilize o código gerado abaixo para cada um deles.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {dependents.map((dep) => {
                    const code = pairingCodes[dep.id] || "REM-999";
                    return (
                      <div key={dep.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-100 shrink-0">
                            <img src={dep.img} alt={dep.name} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <span className="text-[9px] font-black tracking-widest text-[#059669] uppercase bg-emerald-50 px-2 py-0.5 rounded-md">Extensão Ativa</span>
                            <h4 className="font-extrabold text-slate-800 text-base leading-tight mt-1">{dep.name}</h4>
                          </div>
                        </div>

                        <div className="bg-[#f8fafc] border border-slate-100/80 p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center relative overflow-hidden">
                          <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Código de Emparelhamento limitado</p>
                          <div className="flex items-center gap-2">
                            <Key size={16} className="text-emerald-600" />
                            <span className="font-extrabold text-2xl text-emerald-800 tracking-wider font-mono">{code}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 italic font-medium leading-tight pt-1">Este código libera acesso de apenas visualização (Sem permissão de alterações).</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : activeTab === 'users' ? (
              <motion.div 
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="relative mb-3">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    className="w-full bg-white border border-slate-100 rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium" 
                    placeholder="Buscar por nome ou e-mail..." 
                  />
                </div>
                <AccessItem 
                  name="Renan Silva"
                  email="renan@email.com"
                  role="CUIDADOR"
                  img="/img/foto_reinaldo.png"
                />
                <AccessItem 
                  name="Dra. Letícia Moraes"
                  email="leticia@clinica.com"
                  role="MÉDICO"
                  img="/img/foto_medica.png"
                />
              </motion.div>
            ) : (
              <motion.div 
                key="requests"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-50 rounded-3xl p-8 text-center"
              >
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
                  <Mail className="text-slate-300" size={24} />
                </div>
                <h4 className="text-slate-800 font-extrabold">Nenhuma solicitação</h4>
                <p className="text-slate-500 text-sm font-medium mt-1">Quando alguém solicitar acesso, aparecerá aqui.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <section className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="text-emerald-700" size={24} />
            <h3 className="text-lg font-extrabold text-emerald-900">Segurança de Dados</h3>
          </div>
          <p className="text-emerald-800/70 text-sm font-medium leading-relaxed">
            Você é o proprietário dos seus dados. O acesso compartilhado pode ser revogado a qualquer momento nas configurações de cada cuidador ou dependente emparelhado.
          </p>
        </section>
      </main>
    </Layout>
  );
}

function AccessItem({ name, email, role, img }: { name: string, email: string, role: string, img: string }) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 group">
      <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-50">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <h4 className="font-extrabold text-slate-800 text-sm leading-tight">{name}</h4>
          <span className="text-[8px] font-black bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md tracking-tighter uppercase">{role}</span>
        </div>
        <p className="text-xs text-slate-400 font-medium">{email}</p>
      </div>
      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
        <MoreVertical size={20} />
      </button>
    </div>
  );
}
