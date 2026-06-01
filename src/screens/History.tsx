import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Calendar, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { motion } from 'motion/react';
import { useMedications } from '../context/MedicationContext';
import { generateMonthlyPDF } from '../utils/generatePDF';

export default function History() {
  const { medications, inventory, userRole, activeDependent } = useMedications();
  const [filter, setFilter] = useState('Todas');

  const today = new Date();
  const todayStr = String(today.getDate()).padStart(2, '0');
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const startOfWeek = new Date(today);
  const diffToMonday = today.getDay() === 0 ? -6 : 1 - today.getDay();
  startOfWeek.setDate(today.getDate() + diffToMonday);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return { day: dayNames[d.getDay()], date: String(d.getDate()).padStart(2, '0') };
  });

  const month = today.toLocaleDateString('pt-BR', { month: 'long' });
  const monthYearLabel = month.charAt(0).toUpperCase() + month.slice(1) + '/' + today.getFullYear();

  const filteredByDependent = medications
    .filter(m => {
      if ((userRole === 'responsavel' || userRole === 'emparelhado') && activeDependent) {
        return m.dependentId === activeDependent.id;
      }
      return m.dependentId === '2';
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const filteredLogs = (selectedDate === todayStr ? filteredByDependent : filteredByDependent.map(m => ({
    ...m,
    status: parseInt(selectedDate) < today.getDate() ? 'Tomada' : 'Pendente',
    confirmTime: parseInt(selectedDate) < today.getDate() ? m.time : undefined
  } as any))).filter(med => {
    if (filter === 'Todas') return true;
    if (filter === 'Tomadas') return med.status === 'Tomada';
    if (filter === 'Atrasadas') return med.status === 'Atrasada';
    if (filter === 'Puladas') return med.status === 'Pulada';
    if (filter === 'Pendentes') return med.status === 'Pendente';
    return true;
  });

  const getLogType = (status: string) => {
    if (status === 'Tomada') return 'success';
    if (status === 'Atrasada') return 'danger';
    return 'pending';
  };

  const getPeriod = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'Manhã';
    if (hour < 18) return 'Tarde';
    return 'Noite';
  };

  return (
    <Layout>
      <section className="py-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Histórico de Medicamentos</h1>
        <p className="text-slate-500 text-sm font-medium">Acompanhe seu progresso e gere relatórios.</p>
      </section>

      <section className="bg-slate-100 rounded-3xl p-6 mb-8 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Esta Semana</h2>
          <span className="text-emerald-600 font-bold text-sm">{monthYearLabel}</span>
        </div>
        <div className="flex justify-between gap-2 overflow-x-auto pb-2 no-scrollbar">
          {days.map((d, i) => (
            <div 
              key={i}
              onClick={() => setSelectedDate(d.date)}
              className={`flex flex-col items-center gap-2 min-w-[50px] p-2.5 rounded-2xl transition-all cursor-pointer ${selectedDate === d.date ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 scale-110' : 'bg-white text-slate-400 hover:bg-slate-50'}`}
            >
              <span className={`text-[10px] uppercase font-extrabold ${selectedDate === d.date ? 'text-white/80' : 'text-slate-300'}`}>{d.day}</span>
              <span className="text-xl font-extrabold">{d.date}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex gap-3 mb-8 overflow-x-auto no-scrollbar">
        {['Todas', 'Pendentes', 'Tomadas', 'Atrasadas', 'Puladas'].map((option, i) => (
          <button 
            key={i}
            onClick={() => setFilter(option)}
            className={`px-8 py-2.5 rounded-full text-sm font-extrabold transition-all shrink-0 ${filter === option ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-200/60 text-slate-500 hover:bg-slate-200'}`}
          >
            {option}
          </button>
        ))}
      </section>

      <section className="space-y-4">
        {filteredLogs.map((log, i) => {
          const type = log.status === 'Pulada' ? 'pending' : getLogType(log.status);
          return (
            <div key={log.id} className={`relative overflow-hidden bg-white rounded-2xl p-5 flex items-center justify-between shadow-sm hover:-translate-y-0.5 transition-all cursor-pointer ${log.status === 'Pulada' ? 'opacity-60' : ''}`}>
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${type === 'success' ? 'bg-emerald-500' : type === 'danger' ? 'bg-red-500' : 'bg-slate-200'}`} />
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center border-r border-slate-100 pr-4">
                  <span className="text-lg font-extrabold text-slate-900 leading-none">{log.time}</span>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase mt-1 tracking-widest">{getPeriod(log.time)}</span>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">{log.name}</h3>
                  <p className="text-xs text-slate-400 font-medium">{log.dosage} - {log.instructions}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`px-3 py-1 rounded-lg text-[10px] font-extrabold flex items-center gap-1 ${type === 'success' ? 'bg-emerald-50 text-emerald-600' : type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500'}`}>
                  {type === 'success' ? <CheckCircle size={14} fill="currentColor" className="text-emerald-50" /> : type === 'danger' ? <XCircle size={14} fill="currentColor" className="text-red-50" /> : <Clock size={14} />}
                  {log.status}
                </div>
                {log.confirmTime && <span className="text-[9px] text-slate-300 font-bold">Confirmado às {log.confirmTime}</span>}
                {log.status === 'Atrasada' && <span className="text-[9px] text-red-400 font-bold italic">Notificar família?</span>}
              </div>
            </div>
          );
        })}
        {filteredLogs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">Nenhum registro encontrado para este filtro.</p>
          </div>
        )}
      </section>

      <section className="mt-12 mb-8">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-xl shadow-emerald-900/10">
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold mb-2 underline underline-offset-4 decoration-white/20">Relatório Mensal</h2>
            <p className="text-white/70 text-sm mb-6 max-w-[240px] font-medium leading-relaxed">Envie seu histórico completo de adesão diretamente para o seu médico.</p>
            <button
              onClick={() => generateMonthlyPDF(
                activeDependent?.name ?? 'Paciente',
                monthYearLabel,
                filteredByDependent,
                inventory
              )}
              className="bg-white text-emerald-700 px-8 py-4 rounded-full text-sm font-extrabold flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              <FileText size={18} />
              Gerar Relatório em PDF
            </button>
          </div>
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -right-10 -bottom-10"
          >
            <FileText className="w-48 h-48 opacity-10 rotate-12" />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
