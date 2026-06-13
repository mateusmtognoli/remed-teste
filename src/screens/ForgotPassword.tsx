import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ChevronRight, CheckCircle, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Por favor, insira o seu e-mail.'); return; }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-100/30 blur-3xl -z-10" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-emerald-50/40 blur-3xl -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        {/* Logo/Header */}
        <header className="text-center mb-8">
          <div className="mb-8 flex justify-center cursor-pointer" onClick={() => navigate('/login')}>
            <img 
              src="/img/logo_remed.png" 
              alt="ReMed" 
              className="h-10 object-contain"
            />
          </div>
        </header>

        {!sent ? (
          <div className="w-full bg-white border border-slate-100 p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-100/50 space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Recuperar Senha</h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                Digite o e-mail associado à sua conta e enviaremos as instruções para definir uma nova senha.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 tracking-widest uppercase ml-1">SEU E-MAIL</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-700 placeholder-gray-400 transition-all font-medium"
                    required
                    disabled={loading}
                  />
                </div>
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
                    <span>Enviando link...</span>
                  </>
                ) : (
                  <>
                    <span>Enviar instruções</span>
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-slate-50 outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para o login</span>
            </button>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-white border border-slate-100 p-6 sm:p-8 rounded-[2rem] shadow-xl shadow-slate-100/50 text-center space-y-6"
          >
            <div className="flex justify-center">
              <div className="bg-emerald-50 p-4 rounded-full text-emerald-500 border border-emerald-100 shadow-inner">
                <CheckCircle className="w-12 h-12" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">E-mail Enviado!</h1>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[260px] mx-auto">
                Enviamos um link de redefinição de senha para o endereço de e-mail informado:
              </p>
              <div className="bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/40 inline-block">
                <span className="text-sm font-extrabold text-emerald-800 font-mono break-all">{email}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Por favor, verifique também sua caixa de spam se o e-mail não chegar em alguns instantes.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all"
            >
              <span>Entrar</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              className="w-full py-3 bg-white border border-slate-200 text-slate-500 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-slate-50 outline-none"
            >
              <span>Reenviar para outro e-mail</span>
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
