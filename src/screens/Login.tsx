import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ChevronRight, Smartphone, Key, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useMedications } from '../context/MedicationContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pairDevice } = useMedications();
  const { signIn } = useAuth();

  const codeFromUrl = searchParams.get('code') ?? '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const [isPairingMode, setIsPairingMode] = useState(!!codeFromUrl);
  const [pairingCode, setPairingCode] = useState(codeFromUrl);
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [pairingLoading, setPairingLoading] = useState(false);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (!EMAIL_REGEX.test(email)) next.email = 'Insira um e-mail válido.';
    if (password.length < 6) next.password = 'A senha deve ter pelo menos 6 caracteres.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    // Checar ANTES de signIn — signIn sempre seta remed_user_name (prefixo do email)
    const hasProfile = !!localStorage.getItem(`remed_user_name_${email}`);
    signIn(email);
    setTimeout(() => {
      setLoading(false);
      navigate(hasProfile ? '/dashboard' : '/additional-data');
    }, 600);
  };

  const handlePairingCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (val.length > 3) val = val.slice(0, 3) + '-' + val.slice(3, 6);
    setPairingCode(val.slice(0, 7));
  };

  const handlePairingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPairingError(null);
    const res = pairDevice(pairingCode);
    if (res.success) {
      // Cria sessão local para que o PrivateRoute deixe passar.
      // Não passa o nome para não sobrescrever remed_user_name do responsável.
      signIn('emparelhado@remed.local');
      setPairingLoading(true);
      setTimeout(() => navigate('/dashboard'), 1200);
    } else {
      setPairingError(res.error || 'Código inválido.');
    }
  };

  if (pairingLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-[#f0fdfa]">
        <p className="text-emerald-600 font-bold animate-pulse">Emparelhando dispositivo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-[#f0fdfa]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm flex flex-col items-center"
      >
        <header className="text-center mb-8">
          <div className="mb-8 flex justify-center">
            <img src="/img/logo_remed.png" alt="ReMed" className="w-48 h-auto object-contain" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            {isPairingMode ? 'Emparelhar Celular' : 'Bem-vindo de volta'}
          </h1>
          <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">
            {isPairingMode
              ? 'Digite o código fornecido pelo responsável para acessar o aplicativo como dependente.'
              : 'Acesse sua conta para gerenciar seus medicamentos com facilidade.'}
          </p>
        </header>

        {isPairingMode ? (
          <form className="w-full space-y-6" onSubmit={handlePairingSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-800 tracking-widest uppercase ml-1">
                CÓDIGO DE EMPARELHAMENTO
              </label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={pairingCode}
                  onChange={handlePairingCodeChange}
                  placeholder="EX: ANT-753"
                  className="w-full h-14 pl-12 pr-4 bg-white border border-slate-100 rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-700 placeholder-gray-400 font-extrabold text-lg tracking-wider transition-all shadow-sm"
                  required
                />
              </div>
              <p className="text-[11px] text-gray-400 font-medium leading-tight px-1">
                Peça ao responsável o código disponível em Perfil → Gerenciar Acessos.
              </p>
            </div>

            {pairingError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100">
                {pairingError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all hover:bg-emerald-700"
            >
              <span>Emparelhar Dispositivo</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => { setIsPairingMode(false); setPairingError(null); setPairingCode(''); }}
              className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Login</span>
            </button>
          </form>
        ) : (
          <form className="w-full space-y-5" onSubmit={handleSubmit} noValidate>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100"
              >
                {errors.general}
              </motion.div>
            )}

            {/* E-mail */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase ml-1">E-MAIL</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                  placeholder="nome@exemplo.com"
                  disabled={loading}
                  className={`w-full h-14 pl-12 pr-4 bg-gray-100/50 border rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-700 placeholder-gray-400 transition-all hover:bg-gray-200/50 ${errors.email ? 'border-red-400 bg-red-50/30' : 'border-transparent'}`}
                />
              </div>
              {errors.email && <p className="text-[11px] text-red-500 font-semibold ml-1">{errors.email}</p>}
            </div>

            {/* Senha */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase ml-1">SENHA</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full h-14 pl-12 pr-12 bg-gray-100/50 border rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-700 placeholder-gray-400 transition-all hover:bg-gray-200/50 ${errors.password ? 'border-red-400 bg-red-50/30' : 'border-transparent'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-500 font-semibold ml-1">{errors.password}</p>}
            </div>

            <div className="flex justify-between items-center px-1">
              <label onClick={() => setRememberMe(r => !r)} className="flex items-center gap-2 cursor-pointer group">
                <div className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-emerald-500 border-emerald-500' : 'bg-gray-100 border-gray-300 group-hover:border-emerald-400'}`}>
                  {rememberMe && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                </div>
                <span className="text-xs font-bold text-gray-600">Lembrar de mim</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-xs font-semibold text-emerald-800 hover:underline"
              >
                Esqueci minha senha
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all hover:bg-emerald-600 disabled:opacity-70 disabled:pointer-events-none mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar</span>
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => { setIsPairingMode(true); setErrors({}); }}
                className="w-full py-3.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-emerald-100"
              >
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Emparelhar Celular (Dependente)</span>
              </button>
            </div>
          </form>
        )}

        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Ainda não tem conta?{' '}
            <button onClick={() => navigate('/signup')} className="text-emerald-500 font-bold hover:text-emerald-700 transition-colors">
              Criar Conta
            </button>
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
