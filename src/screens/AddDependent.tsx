import React, { useState } from 'react';
import Layout from '../components/Layout';
import {
  UserPlus, Mail, User, Heart, ChevronLeft, CheckCircle2,
  ChevronDown, Check, Copy, Phone, Droplets,
  Ruler, Weight, Hospital, AlertTriangle, Activity,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useMedications } from '../context/MedicationContext';
import { useAuth } from '../context/AuthContext';
import type { Dependent } from '../context/MedicationContext';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function maskPhone(v: string) {
  return v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+$/, '$1');
}

function maskHeight(value: string) {
  const clean = value.replace(/\D/g, '');
  if (clean.length === 0) return '';
  const num = (parseInt(clean) / 100).toFixed(2);
  return `${num} m`;
}

function maskWeight(value: string) {
  const clean = value.replace(/\D/g, '');
  if (clean.length === 0) return '';
  return `${clean} kg`;
}

function maskAge(value: string) {
  const clean = value.replace(/\D/g, '');
  if (clean.length === 0) return '';
  return `${clean} anos`;
}

export default function AddDependent() {
  const navigate = useNavigate();
  const { addDependent } = useMedications();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [createdDependent, setCreatedDependent] = useState<Dependent | null>(null);
  const [copied, setCopied] = useState(false);

  // Step 1
  const [formData, setFormData] = useState({ name: '', email: '', relationship: '' });

  // Step 2 — medical info
  const [phone, setPhone] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('');
  const [conditions, setConditions] = useState('');
  const [allergies, setAllergies] = useState('');

  const relationships = [
    { id: 'pai', label: 'Pai / Mãe' },
    { id: 'avo', label: 'Avô / Avó' },
    { id: 'filho', label: 'Filho(a)' },
    { id: 'paciente', label: 'Paciente' },
    { id: 'outro', label: 'Outro' },
  ];
  const selectedRelation = relationships.find(r => r.id === formData.relationship);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.relationship) return;
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const dep = addDependent({
      name: formData.name,
      img: '',
      relationship: formData.relationship,
      phone,
      bloodType,
      height,
      weight,
      age,
      healthInsurance,
      conditions,
      allergies,
      responsavelName: (user?.user_metadata?.name as string | undefined) || user?.email?.split('@')[0] || 'Responsável',
    });
    setCreatedDependent(dep);
    setStep(3);
  };

  const handleCopyCode = () => {
    if (createdDependent?.pairingCode) {
      navigator.clipboard.writeText(createdDependent.pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Layout>
      <main className="max-w-md mx-auto space-y-8 pb-10">
        <section className="pt-6 flex items-center gap-4">
          {step < 3 && (
            <button
              onClick={() => step === 1 ? navigate(-1) : setStep(1)}
              className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 text-slate-600 active:scale-95 transition-all"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="flex-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
              {step === 1 ? 'Novo Dependente' : step === 2 ? 'Dados do Dependente' : 'Dependente Adicionado'}
            </h2>
            {step < 3 && (
              <div className="flex gap-1.5 mt-2">
                {[1, 2].map(s => (
                  <div key={s} className={`h-1 rounded-full transition-all ${s <= step ? 'bg-emerald-500 flex-1' : 'bg-slate-200 flex-1'}`} />
                ))}
              </div>
            )}
          </div>
        </section>

        <AnimatePresence mode="wait">

          {/* ── Step 1: básico ─────────────────────────────────────── */}
          {step === 1 && (
            <motion.section key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="bg-emerald-50 p-6 rounded-[2.5rem] border border-emerald-100 flex items-center gap-4">
                <div className="bg-emerald-600 p-3 rounded-2xl text-white shadow-lg shadow-emerald-200">
                  <UserPlus size={24} />
                </div>
                <p className="text-emerald-900 font-bold text-sm leading-tight">
                  Adicione um familiar ou paciente para monitorar a saúde em tempo real.
                </p>
              </div>

              <form onSubmit={handleStep1} className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Nome Completo</label>
                  <div className="relative">
                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-12 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      placeholder="Ex: João Silva" />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">E-mail (opcional)</label>
                  <div className="relative">
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-14 bg-white border border-slate-100 rounded-2xl px-12 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      placeholder="pessoa@email.com" />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>

                <div className="space-y-1 relative">
                  <label className="block text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1">Parentesco</label>
                  <button type="button" onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className={`w-full h-14 bg-white border border-slate-100 rounded-2xl px-12 text-sm font-medium shadow-sm text-left flex items-center justify-between ${isSelectOpen ? 'ring-2 ring-emerald-500' : ''}`}>
                    <span className={selectedRelation ? 'text-slate-800' : 'text-slate-400'}>{selectedRelation?.label ?? 'Selecione...'}</span>
                    <ChevronDown size={18} className={`text-slate-300 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
                    <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </button>
                  <AnimatePresence>
                    {isSelectOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 left-0 right-0 top-[110%] bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                        {relationships.map(rel => (
                          <button key={rel.id} type="button" onClick={() => { setFormData({ ...formData, relationship: rel.id }); setIsSelectOpen(false); }}
                            className="w-full flex items-center justify-between p-4 hover:bg-emerald-50 text-sm font-bold text-slate-700 transition-colors">
                            {rel.label}
                            {formData.relationship === rel.id && <Check size={16} className="text-emerald-600" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="pt-4">
                  <button type="submit" disabled={!formData.relationship}
                    className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 active:scale-[0.98] hover:bg-emerald-700 transition-all disabled:opacity-50 disabled:grayscale">
                    Próximo: Dados de Saúde
                  </button>
                </div>
              </form>
            </motion.section>
          )}

          {/* ── Step 2: dados médicos ───────────────────────────────── */}
          {step === 2 && (
            <motion.section key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <form onSubmit={handleStep2} className="space-y-6">

                {/* Tipo sanguíneo */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-50 rounded-xl text-red-500"><Droplets size={18} /></div>
                    <h3 className="font-extrabold text-slate-800">Tipo Sanguíneo</h3>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {BLOOD_TYPES.map(t => (
                      <button key={t} type="button" onClick={() => setBloodType(t === bloodType ? '' : t)}
                        className={`h-10 rounded-xl text-xs font-bold transition-all ${bloodType === t ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Medidas */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><Ruler size={18} /></div>
                    <h3 className="font-extrabold text-slate-800">Informações Pessoais</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1">Altura</label>
                      <input value={height} onChange={e => setHeight(maskHeight(e.target.value))} placeholder="1.70 m"
                        className="w-full h-11 bg-slate-50 border-none rounded-xl px-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1">Peso</label>
                      <input value={weight} onChange={e => setWeight(maskWeight(e.target.value))} placeholder="70 kg"
                        className="w-full h-11 bg-slate-50 border-none rounded-xl px-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1">Idade</label>
                      <input value={age} onChange={e => setAge(maskAge(e.target.value))} placeholder="65 anos"
                        className="w-full h-11 bg-slate-50 border-none rounded-xl px-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* Contato e convênio */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-500"><Phone size={18} /></div>
                    <h3 className="font-extrabold text-slate-800">Contato e Convênio</h3>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1">Telefone</label>
                    <input value={phone} onChange={e => setPhone(maskPhone(e.target.value))} maxLength={15} placeholder="(00) 00000-0000"
                      className="w-full h-11 bg-slate-50 border-none rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1">Convênio Médico <span className="text-slate-300">(opcional)</span></label>
                    <input value={healthInsurance} onChange={e => setHealthInsurance(e.target.value)} placeholder="Nome da operadora"
                      className="w-full h-11 bg-slate-50 border-none rounded-xl px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>

                {/* Histórico médico */}
                <div className="bg-white border border-slate-100 rounded-3xl p-5 space-y-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-500"><AlertTriangle size={18} /></div>
                    <h3 className="font-extrabold text-slate-800">Histórico Médico</h3>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1">Condições e Doenças</label>
                    <textarea value={conditions} onChange={e => setConditions(e.target.value)} rows={2} placeholder="Ex: Hipertensão, Diabetes..."
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 resize-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest ml-1">Alergias Conhecidas</label>
                    <textarea value={allergies} onChange={e => setAllergies(e.target.value)} rows={2} placeholder="Ex: Penicilina, Dipirona..."
                      className="w-full bg-slate-50 border-none rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 resize-none" />
                  </div>
                </div>

                <button type="submit"
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-emerald-200 active:scale-[0.98] hover:bg-emerald-700 transition-all">
                  Concluir Cadastro
                </button>
              </form>
            </motion.section>
          )}

          {/* ── Step 3: sucesso + código ────────────────────────────── */}
          {step === 3 && (
            <motion.section key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8 py-6 px-2">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border-4 border-white shadow-xl">
                <CheckCircle2 className="text-emerald-600" size={48} />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Dependente Adicionado!</h3>
                <p className="text-slate-500 font-medium leading-relaxed">
                  <strong>{formData.name}</strong> foi cadastrado com sucesso. Compartilhe o código ou o link abaixo para emparelhar o celular dele.
                </p>
              </div>

              {createdDependent?.pairingCode && (
                <>
                  {/* Código */}
                  <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 space-y-3">
                    <p className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-widest">Código de Emparelhamento</p>
                    <p className="text-4xl font-black text-emerald-800 tracking-[0.2em]">{createdDependent.pairingCode}</p>
                    <button onClick={handleCopyCode} className="flex items-center gap-2 mx-auto text-emerald-700 font-bold text-sm active:scale-95 transition-all">
                      <Copy size={15} />
                      {copied ? 'Copiado!' : 'Copiar código'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 font-medium px-4 leading-relaxed">
                    O dependente deve abrir este link ou inserir o código na tela de login → "Emparelhar Celular".
                  </p>
                </>
              )}

              <button onClick={() => navigate('/profile')}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-extrabold text-sm shadow-lg active:scale-[0.98] transition-all">
                Ir para o Perfil
              </button>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </Layout>
  );
}
