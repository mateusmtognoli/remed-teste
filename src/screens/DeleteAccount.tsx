import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useMedications } from '../context/MedicationContext';

export default function DeleteAccount() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { dependents, unpairDevice, userRole } = useMedications();
  const [confirmText, setConfirmText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const canDelete = confirmText.trim().toUpperCase() === 'EXCLUIR';

  const handleDelete = () => {
    const userKey = localStorage.getItem('remed_current_user') || 'default';
    const email = localStorage.getItem('remed_user_email') || '';

    // Remove o índice global de emparelhamento dos dependentes desta conta
    try {
      const lookup = JSON.parse(localStorage.getItem('remed_pairing_lookup') || '{}');
      dependents.forEach(dep => {
        if (dep.pairingCode) {
          delete lookup[dep.pairingCode];
          localStorage.removeItem(`remed_pair_owner_${dep.pairingCode}`);
        }
      });
      localStorage.setItem('remed_pairing_lookup', JSON.stringify(lookup));
    } catch {
      // ignora falhas ao limpar o índice global
    }

    // Remove todos os dados escopados a esta conta
    Object.keys(localStorage)
      .filter(key => key.endsWith(`_${userKey}`))
      .forEach(key => localStorage.removeItem(key));

    localStorage.removeItem(`remed_user_name_${email}`);
    localStorage.removeItem('remed_responsavel_key');

    if (userRole === 'emparelhado') unpairDevice();
    signOut();
    navigate('/login');
  };

  return (
    <Layout>
      <main className="max-w-md mx-auto space-y-8 pb-10">
        <section className="pt-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-red-100 p-3 rounded-2xl text-red-600">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Excluir Minha Conta</h2>
              <p className="text-slate-500 font-medium text-sm">Essa ação é permanente e não pode ser desfeita.</p>
            </div>
          </div>
        </section>

        <section className="bg-red-50 border border-red-100 rounded-[2.5rem] p-6 space-y-3">
          <h3 className="font-extrabold text-red-700 text-sm uppercase tracking-widest">Ao excluir sua conta, você perderá:</h3>
          <ul className="space-y-2 text-sm font-bold text-red-700">
            <li className="flex items-start gap-2"><span className="text-red-400">•</span> Todos os dependentes cadastrados e seus dados de saúde</li>
            <li className="flex items-start gap-2"><span className="text-red-400">•</span> Lembretes, histórico de doses e relatórios de adesão</li>
            <li className="flex items-start gap-2"><span className="text-red-400">•</span> Estoque de medicamentos registrado</li>
            <li className="flex items-start gap-2"><span className="text-red-400">•</span> Códigos de emparelhamento ativos</li>
          </ul>
        </section>

        <section className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase ml-1">
            Digite "EXCLUIR" para confirmar
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder="EXCLUIR"
            className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-400 shadow-sm font-bold uppercase"
          />
        </section>

        <button
          onClick={() => setShowModal(true)}
          disabled={!canDelete}
          className="w-full py-5 bg-red-500 text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-lg shadow-red-100 active:scale-[0.98] transition-all disabled:opacity-40 disabled:pointer-events-none"
        >
          Excluir Minha Conta
        </button>

        <button
          onClick={() => navigate('/security')}
          className="w-full py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl active:scale-[0.98] transition-all hover:bg-slate-50 outline-none"
        >
          Voltar
        </button>
      </main>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
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
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Excluir conta permanentemente?</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  Todos os seus dados serão removidos deste dispositivo e não poderão ser recuperados.
                </p>
                <div className="w-full grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="py-4 bg-slate-100 text-slate-600 font-extrabold rounded-2xl active:scale-95 transition-all hover:bg-slate-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleDelete}
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
