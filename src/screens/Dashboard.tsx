import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Clock, CheckCircle, AlertTriangle, Activity, Package, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMedications } from '../context/MedicationContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { medications, inventory, updateStatus, removeMedication, userRole, activeDependent, setActiveDependent, dependents } = useMedications();
  const [medToDelete, setMedToDelete] = useState<{ id: string; name: string } | null>(null);

  const confirmRemove = () => {
    if (medToDelete) removeMedication(medToDelete.id);
    setMedToDelete(null);
  };

  const filteredMedications = medications
    .filter(m => m.dependentId === activeDependent?.id)
    .sort((a, b) => a.time.localeCompare(b.time));

  const totalDoses = filteredMedications.length;
  const takenDoses = filteredMedications.filter(m => m.status === 'Tomada').length;
  const progressPercent = totalDoses > 0 ? (takenDoses / totalDoses) * 100 : 0;

  const minDaysLeft = inventory.length > 0 ? Math.min(...inventory.map(i => i.daysLeft)) : null;

  return (
    <Layout>
      {userRole === 'responsavel' && activeDependent && (
        <section className="mb-6 flex items-center justify-between bg-white/60 backdrop-blur-sm border border-slate-200/50 p-4 rounded-3xl shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
              <img src={activeDependent.img} alt={activeDependent.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="block text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest">Monitorando agora</span>
              <h3 className="text-base font-extrabold text-slate-800 leading-tight">{activeDependent.name}</h3>
            </div>
          </div>
          
          <div className="relative">
            <select 
              value={activeDependent.id}
              onChange={(e) => {
                const dep = dependents.find(d => d.id === e.target.value);
                if (dep) setActiveDependent(dep);
              }}
              className="appearance-none bg-emerald-50 border-emerald-100 border rounded-2xl pl-5 pr-12 py-3 text-xs font-extrabold text-emerald-800 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer transition-all hover:bg-emerald-100 shadow-sm"
            >
              {dependents.map(dep => (
                <option key={dep.id} value={dep.id} className="font-bold text-slate-700">{dep.name}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 bg-emerald-100/50 p-1 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </section>
      )}

      {userRole === 'emparelhado' && activeDependent && (
        <section className="mb-6 flex items-center justify-between bg-amber-50 border border-amber-200/50 p-4 rounded-3xl shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
              <img src={activeDependent.img} alt={activeDependent.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="flex items-center gap-1 text-[9px] font-extrabold text-amber-700 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> Dispositivo Emparelhado
              </span>
              <h3 className="text-base font-extrabold text-slate-800 leading-tight">{activeDependent.name}</h3>
            </div>
          </div>
          
          <div className="bg-amber-100/80 text-amber-800 pl-3 pr-4 py-1.5 rounded-full text-[9px] font-extrabold tracking-widest flex items-center gap-1.5 shrink-0 border border-amber-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            SÓ LEITURA
          </div>
        </section>
      )}

      <header className="mb-8">
        <section className="relative overflow-hidden bg-emerald-600 rounded-3xl p-6 text-white shadow-xl">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm opacity-90 font-medium">Meta de hoje</p>
                <h2 className="text-3xl font-extrabold tracking-tight">Progresso do dia</h2>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3">
                <span className="text-2xl font-bold">{Math.round(progressPercent)}%</span>
              </div>
            </div>
            <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="bg-white h-full rounded-full shadow-[0_0_12px_rgba(255,255,255,0.5)]"
              />
            </div>
            <p className="font-medium text-lg">{takenDoses} de {totalDoses} doses tomadas.</p>
          </div>
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </section>
      </header>

      <section className="space-y-6">
        <div className="flex justify-between items-end px-1">
          <h3 className="text-xl font-bold text-slate-800">Próximas Doses</h3>
          <span className="text-emerald-600 font-semibold text-sm">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
          </span>
        </div>

        <div className="space-y-4">
          {filteredMedications.map((med) => (
            <div 
              key={med.id} 
              className={`bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-4 relative overflow-hidden border transition-all ${
                med.status === 'Pulada' ? 'opacity-60 grayscale' : 'border-slate-100'
              } hover:shadow-md hover:border-emerald-100 group`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2 ${
                med.status === 'Tomada' ? 'bg-[#4edea3]' : 
                med.status === 'Atrasada' ? 'bg-red-500' : 
                med.status === 'Pulada' ? 'bg-slate-300' : 'bg-emerald-500'
              }`} />
              
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-slate-900">{med.name}</h4>
                  <p className={`text-sm flex items-center gap-1 font-medium ${med.status === 'Atrasada' ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                    {med.status === 'Atrasada' ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                    {med.time} {med.status === 'Atrasada' ? '(Atrasada)' : ''}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                    med.status === 'Tomada' ? 'bg-[#b7ebd7] text-[#00714d]' :
                    med.status === 'Atrasada' ? 'bg-red-100 text-red-700' :
                    med.status === 'Pulada' ? 'bg-slate-100 text-slate-500' :
                    'bg-emerald-50 text-emerald-700'
                  }`}>
                    {med.status}
                  </span>
                  {userRole !== 'emparelhado' && (
                    <button
                      onClick={() => setMedToDelete({ id: med.id, name: med.name })}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label={`Excluir ${med.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {med.status === 'Tomada' ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <CheckCircle className="w-5 h-5 fill-emerald-600 text-white" />
                  Dose confirmada às {med.confirmTime}
                </div>
              ) : med.status === 'Pulada' ? (
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                  <span className="text-base">×</span> Dose ignorada hoje
                </div>
              ) : userRole === 'emparelhado' ? (
                <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl flex items-center gap-2 text-slate-500 text-xs font-semibold leading-tight mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>Dose pendente de confirmação pelo seu responsável{activeDependent?.responsavelName ? ` (${activeDependent.responsavelName})` : ''}.</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button 
                    onClick={() => updateStatus(med.id, 'Tomada')}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold py-3 px-4 rounded-full shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> {userRole === 'responsavel' ? 'Confirmar Dose' : 'Tomar Agora'}
                  </button>
                  <button 
                    onClick={() => updateStatus(med.id, 'Pulada')}
                    className="bg-slate-100 text-slate-500 font-bold py-3 px-4 rounded-full active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">×</span> Pular Dose
                  </button>
                </div>
              )}
            </div>
          ))}

          {medications.length === 0 && (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-medium">Nenhum medicamento para hoje.</p>
              <button 
                onClick={() => navigate('/add-medication')}
                className="mt-2 text-emerald-600 font-bold text-sm hover:underline"
              >
                Cadastrar agora
              </button>
            </div>
          )}
        </div>
      </section>

      {userRole !== 'emparelhado' && (
        <section className="grid grid-cols-2 gap-4 mt-8">
          <button
            onClick={() => navigate('/stock')}
            className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center space-y-3 hover:scale-[1.02] active:scale-95 transition-all group"
          >
            <div className="bg-emerald-100/50 p-2 rounded-xl group-hover:bg-emerald-100 transition-colors">
              <Package className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">Gerenciar Estoque</p>
            <p className="text-2xl font-extrabold text-slate-900">{minDaysLeft !== null ? `${minDaysLeft} dias` : '—'}</p>
          </button>
          <div className="bg-white p-5 rounded-3xl shadow-sm flex flex-col items-center justify-center text-center space-y-3 hover:bg-slate-50 transition-all cursor-pointer active:scale-[0.98]">
            <div className="bg-emerald-50 p-2 rounded-xl">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-extrabold tracking-widest">Adesão</p>
            <p className="text-2xl font-extrabold text-slate-900">{totalDoses > 0 ? `${Math.round(progressPercent)}%` : '—'}</p>
          </div>
        </section>
      )}

      <AnimatePresence>
        {medToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMedToDelete(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-5">
                  <Trash2 size={28} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Excluir medicamento?</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  Tem certeza que deseja excluir <strong className="text-slate-700">"{medToDelete.name}"</strong>? Essa ação não pode ser desfeita.
                </p>
                <div className="w-full grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setMedToDelete(null)}
                    className="py-4 bg-slate-100 text-slate-600 font-extrabold rounded-2xl active:scale-95 transition-all hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmRemove}
                    className="py-4 bg-red-500 text-white font-extrabold rounded-2xl shadow-lg shadow-red-100 active:scale-95 transition-all hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Layout>
  );
}
