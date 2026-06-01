import React, { useState } from 'react';
import Layout from '../components/Layout';
import { UserPlus, Mail, User, Heart, ChevronLeft, CheckCircle2, ChevronDown, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function AddDependent() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    relationship: ''
  });

  const relationships = [
    { id: 'pai', label: 'Pai / Mãe' },
    { id: 'avo', label: 'Avô / Avó' },
    { id: 'filho', label: 'Filho(a)' },
    { id: 'paciente', label: 'Paciente' },
    { id: 'outro', label: 'Outro' },
  ];

  const selectedRelation = relationships.find(r => r.id === formData.relationship);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.relationship) return;
    setStep(2);
    // In a real app, logic to send invitation would go here
    setTimeout(() => navigate('/manage-access'), 3000);
  };

  return (
    <Layout>
      <main className="max-w-md mx-auto space-y-8 pb-10">
        <section className="pt-6 flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">Novo Dependente</h2>
        </section>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.section 
              key="form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-center gap-4 mb-8">
                <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-200">
                  <UserPlus size={24} />
                </div>
                <p className="text-emerald-900 font-bold text-sm leading-tight">
                  Adicione um familiar ou paciente para monitorar a saúde em tempo real.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Nome Completo</label>
                  <div className="relative">
                    <input 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-12 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all" 
                      placeholder="Ex: João Silva" 
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">E-mail do Dependente</label>
                  <div className="relative">
                    <input 
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-12 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm transition-all" 
                      placeholder="pessoa@email.com" 
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium ml-1">Enviaremos um convite para este e-mail.</p>
                </div>

                <div className="space-y-1 relative">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Parentesco</label>
                  <button 
                    type="button"
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className={`w-full h-14 bg-white border border-slate-100 rounded-2xl px-12 text-sm font-medium shadow-sm transition-all text-left flex items-center justify-between ${isSelectOpen ? 'ring-2 ring-emerald-500' : ''}`}
                  >
                    <span className={selectedRelation ? 'text-slate-800' : 'text-slate-400'}>
                      {selectedRelation ? selectedRelation.label : 'Selecione...'}
                    </span>
                    <ChevronDown size={18} className={`text-slate-300 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
                    <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </button>

                  <AnimatePresence>
                    {isSelectOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute z-20 left-0 right-0 top-[110%] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden"
                      >
                        {relationships.map((rel) => (
                          <button
                            key={rel.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, relationship: rel.id });
                              setIsSelectOpen(false);
                            }}
                            className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 text-sm font-bold text-slate-700 transition-colors"
                          >
                            {rel.label}
                            {formData.relationship === rel.id && <Check size={16} className="text-emerald-600" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 active:scale-[0.98] hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:grayscale"
                    disabled={!formData.relationship}
                  >
                    Enviar Convite
                  </button>
                </div>
              </form>
            </motion.section>
          ) : (
            <motion.section 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 px-6"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
                <CheckCircle2 className="text-emerald-600" size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Convite Enviado!</h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                {formData.name} receberá um e-mail com as instruções para vincular a conta.
              </p>
              <div className="mt-10 flex flex-col gap-1 items-center">
                <div className="w-12 h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: -48 }}
                    animate={{ x: 0 }}
                    transition={{ duration: 3 }}
                    className="w-full h-full bg-emerald-500"
                  />
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Redirecionando...</span>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </Layout>
  );
}
