import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Pill, Clock, Settings, Volume2, Save } from 'lucide-react';
import { useMedications } from '../context/MedicationContext';

export default function AddMedication() {
  const navigate = useNavigate();
  const { addMedication, activeDependent, userRole } = useMedications();
  const responsavelName = activeDependent?.responsavelName || 'seu responsável';

  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  
  const [repeat, setRepeat] = useState(true);
  const [sound, setSound] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const toggleDay = (day: number) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!name) return alert('Por favor, insira o nome do medicamento.');
    
    addMedication({
      name,
      dosage,
      instructions,
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
      days: selectedDays,
      category: 'Medicamento',
      dependentId: activeDependent?.id
    });
    
    navigate('/dashboard');
  };

  if (userRole === 'emparelhado') {
    return (
      <Layout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="bg-amber-50 p-4 rounded-full text-amber-600 animate-pulse border border-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-alert"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Recurso Limitado</h3>
            <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm mx-auto">
              Como dispositivo emparelhado, a inserção ou alteração de tratamentos e receitas deve ser realizada pelo seu cuidador principal (<strong>{responsavelName}</strong>) no celular dele.
            </p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl active:scale-95 transition-all shadow-md shadow-emerald-950/10"
          >
            Voltar ao Início
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <header className="mb-8">
        <h2 className="font-bold text-3xl text-slate-900 leading-tight">Cadastrar Novo Medicamento</h2>
        <p className="text-slate-500 mt-2 font-medium">Configure os detalhes e horários para o seu lembrete.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-slate-100 rounded-[2rem] p-6 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <Pill className="text-emerald-600 w-6 h-6" />
            <h3 className="font-bold text-lg">Informações Básicas</h3>
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block font-semibold text-sm ml-1 text-slate-700">Nome do Medicamento</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-300 font-medium" 
                placeholder="Ex: Paracetamol" 
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-sm ml-1 text-slate-700">Dosagem</label>
                <input 
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full bg-white border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-emerald-500 transition-all font-medium" 
                  placeholder="Ex: 1 comprimido" 
                />
              </div>
              <div className="space-y-1">
                <label className="block font-semibold text-sm ml-1 text-slate-700">Instruções</label>
                <input 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full bg-white border-none rounded-2xl py-4 px-5 focus:ring-2 focus:ring-emerald-500 transition-all font-medium" 
                  placeholder="Ex: Tomar com comida" 
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-100 rounded-[2rem] p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-emerald-600 w-6 h-6" />
            <h3 className="font-bold text-lg">Cronograma</h3>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block font-semibold text-sm mb-3 ml-1 text-slate-700">Horário da Dose</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white rounded-3xl p-4 flex flex-col items-center justify-center shadow-sm border border-slate-200/50">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mb-1">Hora</span>
                  <input 
                    type="number" 
                    min="0" 
                    max="23"
                    value={hour.toString().padStart(2, '0')} 
                    onChange={(e) => setHour(Math.max(0, Math.min(23, parseInt(e.target.value) || 0)))}
                    className="w-full text-center border-none bg-transparent font-extrabold text-4xl p-0 focus:ring-0 text-slate-900" 
                  />
                </div>
                <span className="font-bold text-2xl text-slate-400">:</span>
                <div className="flex-1 bg-white rounded-3xl p-4 flex flex-col items-center justify-center shadow-sm border border-slate-200/50">
                  <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mb-1">Minuto</span>
                  <input 
                    type="number" 
                    min="0" 
                    max="59"
                    value={minute.toString().padStart(2, '0')} 
                    onChange={(e) => setMinute(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                    className="w-full text-center border-none bg-transparent font-extrabold text-4xl p-0 focus:ring-0 text-slate-900" 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-100 rounded-[2rem] p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="text-emerald-600 w-6 h-6" />
            <h3 className="font-bold text-lg">Avançado</h3>
          </div>
          <div className="space-y-3">
            <div 
              onClick={() => setRepeat(!repeat)}
              className="flex items-center justify-between bg-white p-4 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors shadow-sm border border-slate-200/50"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400" />
                <span className="font-bold text-slate-700">Repetir lembrete</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${repeat ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-all ${repeat ? 'right-1' : 'left-1'}`} />
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200/50 shadow-sm">
              <label className="block font-extrabold text-[10px] uppercase tracking-widest mb-4 text-emerald-600">Frequência</label>
              <div className="flex justify-between items-center gap-1">
                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                  <button 
                    key={i}
                    onClick={() => toggleDay(i)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all active:scale-90 ${selectedDays.includes(i) ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100' : 'bg-slate-100 text-slate-400'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div 
              onClick={() => setSound(!sound)}
              className="flex items-center justify-between bg-white p-4 rounded-2xl cursor-pointer hover:bg-emerald-50 transition-colors shadow-sm border border-slate-200/50"
            >
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-slate-400" />
                <span className="font-bold text-slate-700">Som e Vibração</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${sound ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-all ${sound ? 'right-1' : 'left-1'}`} />
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={handleSave}
          className="w-full py-5 rounded-full bg-emerald-700 text-white font-extrabold text-lg shadow-xl shadow-emerald-100 active:scale-95 transition-all mt-4 hover:bg-emerald-800 flex items-center justify-center gap-3"
        >
          <Save size={20} />
          Salvar Lembrete
        </button>
      </div>
    </Layout>
  );
}
