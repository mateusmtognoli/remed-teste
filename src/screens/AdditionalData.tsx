import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Hospital, Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useMedications } from '../context/MedicationContext';

export default function AdditionalData() {
  const navigate = useNavigate();
  const { userRole } = useMedications();
  const [bloodType, setBloodType] = useState<string | null>(null);
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const maskCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const maskDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\/\d{4})\d+?$/, '$1');
  };

  const maskHeight = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length === 0) return '';
    const num = (parseInt(clean) / 100).toFixed(2);
    return `${num} m`;
  };

  const maskWeight = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d+)/, '$1 kg');
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center gap-2">
        <img 
          src="/img/logo_remed.png" 
          alt="ReMed" 
          className="h-8 w-auto"
        />
        <span className="font-extrabold text-emerald-700 tracking-tight text-xl">ReMed</span>
      </header>

      <main className="px-6 pt-8 max-w-md mx-auto">
        <section className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Dados Complementares</h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Precisamos de mais alguns detalhes para personalizar seu cuidado.
          </p>
        </section>

        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100/50 rounded-xl text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <h2 className="font-bold text-slate-800">Identificação</h2>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1">CPF</label>
              <input 
                value={cpf}
                onChange={(e) => setCpf(maskCpf(e.target.value))}
                className="w-full h-12 bg-white border-none rounded-2xl px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm" 
                placeholder="000.000.000-00" 
                maxLength={14}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1">Data de Nascimento</label>
              <div className="relative">
                <input 
                  value={birthDate}
                  onChange={(e) => setBirthDate(maskDate(e.target.value))}
                  className="w-full h-12 bg-white border-none rounded-2xl px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm" 
                  placeholder="dd/mm/aaaa" 
                  maxLength={10}
                  required
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-100/50 rounded-xl text-emerald-600">
                <MapPin size={20} />
              </div>
              <h2 className="font-bold text-slate-800">Endereço e Contato</h2>
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1">Endereço Completo</label>
              <input className="w-full h-12 bg-white border-none rounded-2xl px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm" placeholder="Rua, Número, Bairro, Cidade" />
            </div>
            <div className="space-y-1">
              <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1">Telefone de Emergência</label>
              <input 
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
                className="w-full h-12 bg-white border-none rounded-2xl px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm" 
                placeholder="(00) 00000-0000" 
                maxLength={15}
                required
              />
            </div>
          </div>

          {userRole === 'dependente' && (
            <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-5 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100/50 rounded-xl text-emerald-600">
                  <Hospital size={20} />
                </div>
                <h2 className="font-bold text-slate-800">Ficha Médica</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1">Altura</label>
                  <input 
                    value={height}
                    onChange={(e) => setHeight(maskHeight(e.target.value))}
                    className="w-full h-12 bg-white border-none rounded-2xl px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm" 
                    placeholder="0.00 m" 
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1">Peso</label>
                  <input 
                    value={weight}
                    onChange={(e) => setWeight(maskWeight(e.target.value))}
                    className="w-full h-12 bg-white border-none rounded-2xl px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm" 
                    placeholder="00 kg" 
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1">Convênio Médico (Opcional)</label>
                <input className="w-full h-12 bg-white border-none rounded-2xl px-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm" placeholder="Nome da Operadora" />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1">Doenças e Condições</label>
                <textarea className="w-full bg-white border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm resize-none" placeholder="Ex: Hipertensão, Diabetes..." rows={2} />
              </div>
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1">Alergias Conhecidas</label>
                <textarea className="w-full bg-white border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-emerald-500 shadow-sm resize-none" placeholder="Ex: Penicilina, Corantes..." rows={2} />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-emerald-600 uppercase tracking-wider ml-1">Tipo Sanguíneo</label>
                <div className="grid grid-cols-4 gap-2">
                  {bloodTypes.map((type) => (
                    <button 
                      key={type}
                      type="button"
                      onClick={() => setBloodType(type)}
                      className={`h-10 rounded-xl text-xs font-bold transition-all ${bloodType === type ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-white text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="pt-6">
            <button 
              type="submit"
              className="w-full h-16 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:brightness-110"
            >
              <CheckCircle size={20} strokeWidth={2.5} />
              Finalizar Cadastro
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
