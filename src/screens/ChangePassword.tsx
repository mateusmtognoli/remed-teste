import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Key, Eye, EyeOff, CheckCircle2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentPassword) { setError('Informe sua senha atual.'); return; }
    if (newPassword.length < 8) { setError('A nova senha deve ter pelo menos 8 caracteres.'); return; }
    if (newPassword !== confirmPassword) { setError('As senhas não coincidem.'); return; }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1000);
  };

  return (
    <Layout>
      <main className="max-w-md mx-auto space-y-8 pb-10">
        <section className="pt-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-700">
              <Key size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Alterar Senha</h2>
              <p className="text-slate-500 font-medium text-sm">Atualize sua senha de acesso periodicamente.</p>
            </div>
          </div>
        </section>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-2 text-emerald-700 font-bold text-sm"
          >
            <CheckCircle2 size={18} />
            Senha atualizada com sucesso!
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="bg-slate-50 rounded-[2.5rem] p-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase ml-1">Senha Atual</label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={e => { setCurrentPassword(e.target.value); setError(null); }}
                placeholder="Digite sua senha atual"
                className="w-full bg-white border border-slate-100 rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium"
                disabled={loading}
              />
              <button type="button" onClick={() => setShowCurrent(s => !s)} tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase ml-1">Nova Senha</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={e => { setNewPassword(e.target.value); setError(null); }}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-white border border-slate-100 rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium"
                disabled={loading}
              />
              <button type="button" onClick={() => setShowNew(s => !s)} tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase ml-1">Confirmar Nova Senha</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setError(null); }}
                placeholder="Repita a nova senha"
                className="w-full bg-white border border-slate-100 rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium"
                disabled={loading}
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)} tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword.length > 0 && newPassword === confirmPassword && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 ml-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Senhas coincidem
              </p>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all disabled:opacity-75 disabled:pointer-events-none"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <span>Salvar Nova Senha</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/security')}
            className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl active:scale-[0.98] transition-all hover:bg-slate-50 outline-none"
          >
            Voltar
          </button>
        </form>
      </main>
    </Layout>
  );
}
