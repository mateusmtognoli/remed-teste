import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Package, Database, PlusCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useMedications } from '../context/MedicationContext';

export default function Stock() {
  const navigate = useNavigate();
  const { inventory, removeInventoryItem } = useMedications();
  const [itemToDelete, setItemToDelete] = React.useState<{ id: string; name: string } | null>(null);

  const confirmRemove = () => {
    if (itemToDelete) removeInventoryItem(itemToDelete.id);
    setItemToDelete(null);
  };

  return (
    <Layout>
      <header className="mb-8 px-1">
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Estoque</h2>
        <p className="text-slate-500 mt-2 font-medium">Acompanhe a quantidade disponível dos seus medicamentos.</p>
      </header>

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
                    <span className={`text-xs flex items-center gap-1 ${item.status === 'Crítico' ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                      <Package size={12} /> {item.count} unidades
                    </span>
                  </div>
                </div>
                <div className="w-full sm:w-auto flex flex-col items-end gap-2">
                  <button
                    onClick={() => setItemToDelete({ id: item.id, name: item.name })}
                    className="p-1 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                    aria-label={`Excluir ${item.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => navigate(`/restock/${item.id}`)}
                    className={`w-full sm:w-auto font-bold px-8 py-2.5 rounded-lg active:scale-95 transition-all ${item.status === 'Crítico' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                  >
                    Repor
                  </button>
                </div>
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
          Adicionar Medicamento
        </button>
        <p className="mt-4 text-sm text-slate-400 font-medium italic">Última atualização: Hoje, 08:30</p>
      </div>

      <AnimatePresence>
        {itemToDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setItemToDelete(null)}
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
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Excluir do estoque?</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  Tem certeza que deseja excluir <strong className="text-slate-700">"{itemToDelete.name}"</strong> do estoque? Essa ação não pode ser desfeita.
                </p>
                <div className="w-full grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setItemToDelete(null)}
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
