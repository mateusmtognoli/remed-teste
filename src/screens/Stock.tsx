import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { AlertCircle, Bell, Package, Database, Clock, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useMedications } from '../context/MedicationContext';

export default function Stock() {
  const navigate = useNavigate();
  const { inventory } = useMedications();
  const [alertActive, setAlertActive] = React.useState(true);

  const criticalCount = inventory.filter(i => i.status === 'Crítico').length;

  return (
    <Layout>
      <section className="mb-10">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Estoque</h2>
          <span className={`text-[10px] font-bold uppercase tracking-wider ${criticalCount > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
            Status: {criticalCount > 0 ? 'Alerta' : 'Normal'}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-200/50 rounded-xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Medicamentos Críticos</p>
              <h3 className="text-4xl font-extrabold text-red-500 tracking-tighter">
                {criticalCount.toString().padStart(2, '0')}
              </h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">Itens abaixo do limite mínimo definido.</p>
            </div>
            <AlertCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-red-500/10" />
          </div>
          <div className="bg-emerald-100/50 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Próxima Reposição</p>
              <p className="text-xl font-extrabold text-emerald-700">Em 4 dias</p>
            </div>
          </div>
        </div>
      </section>

      <section 
        onClick={() => setAlertActive(!alertActive)}
        className="bg-slate-50 rounded-2xl p-5 mb-8 flex items-center justify-between border border-slate-100 shadow-sm cursor-pointer hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${alertActive ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
            <Bell size={24} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Alertas de Estoque Baixo</h4>
            <p className="text-sm text-slate-400 font-medium">Notificar quando restar 3 dias</p>
          </div>
        </div>
        <div className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors ${alertActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
          <div className={`w-4 h-4 bg-white rounded-full absolute shadow-sm transition-all ${alertActive ? 'right-1' : 'left-1'}`} />
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 px-1">
          <Package className="text-emerald-600 w-5 h-5" /> Seu Estoque
        </h3>

        <div className="space-y-6">
          {inventory.map((item) => (
            <div key={item.id} className="group transition-all">
              <div className="bg-white rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 ${item.status === 'Crítico' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'} rounded-xl flex items-center justify-center`}>
                  <Database size={28} />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 leading-tight">{item.name}</h4>
                    {item.status && (
                      <span className={`px-2 py-0.5 ${item.status === 'Crítico' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'} text-[9px] font-extrabold rounded-full uppercase tracking-wider`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-4 mt-1 font-medium">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Package size={12} /> {item.count} unidades
                    </span>
                    <span className={`text-xs ${item.status === 'Crítico' ? 'text-red-500 font-bold' : 'text-slate-400'} flex items-center gap-1`}>
                      <Clock size={12} /> {item.daysLeft} dias restantes
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate(`/restock/${item.id}`)}
                  className={`w-full sm:w-auto font-bold px-8 py-2.5 rounded-lg active:scale-95 transition-all ${item.status === 'Crítico' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                >
                  Repor
                </button>
              </div>
              <div className="mt-2 mx-5 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: item.bar }}
                  className={`h-full rounded-full ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12 text-center pb-6">
        <button 
          onClick={() => navigate('/add-stock')}
          className="w-full bg-gradient-to-r from-emerald-600 to-[#10b981] text-white font-bold py-4 px-8 rounded-2xl shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
        >
          <PlusCircle size={20} />
          Adicionar ao Estoque
        </button>
        <p className="mt-4 text-sm text-slate-400 font-medium italic">Última atualização: Hoje, 08:30</p>
      </div>
    </Layout>
  );
}
