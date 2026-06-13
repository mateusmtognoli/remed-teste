import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function passwordStrength(pwd: string): 0 | 1 | 2 | 3 {
  if (pwd.length === 0) return 0;
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;
  return score as 0 | 1 | 2 | 3;
}

const strengthLabel = ['', 'Fraca', 'Moderada', 'Forte'] as const;
const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-500'] as const;
const strengthText = ['', 'text-red-500', 'text-amber-500', 'text-emerald-600'] as const;

export default function SignUp() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string; email?: string; password?: string; confirmPassword?: string; general?: string;
  }>({});

  const strength = passwordStrength(password);

  const validate = (): boolean => {
    const next: typeof errors = {};
    if (name.trim().length < 3) next.name = 'Nome deve ter pelo menos 3 caracteres.';
    if (!EMAIL_REGEX.test(email)) next.email = 'Insira um e-mail válido.';
    if (password.length < 8) next.password = 'A senha deve ter pelo menos 8 caracteres.';
    if (password !== confirmPassword) next.confirmPassword = 'As senhas não coincidem.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    signIn(email, name.trim());
    setTimeout(() => {
      setLoading(false);
      navigate('/additional-data');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <header className="w-full flex flex-col items-center mb-8">
        <div className="w-32 mb-6">
          <img src="/img/logo_remed.png" alt="ReMed" className="w-full h-auto" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Comece seu cuidado</h1>
          <p className="text-sm text-gray-500 max-w-[250px] mx-auto leading-tight">
            Crie sua conta para nunca mais perder uma dose.
          </p>
        </div>
      </header>

      <main className="w-full max-w-sm flex-grow">
        <form className="space-y-4 mb-8" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100"
            >
              {errors.general}
            </motion.div>
          )}

          {/* Nome */}
          <div className="space-y-1">
            <div className="relative">
              <input
                value={name}
                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })); }}
                className={`w-full bg-gray-100 border rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium ${errors.name ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                placeholder="Nome Completo"
                disabled={loading}
              />
              <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.name && <p className="text-[11px] text-red-500 font-semibold ml-1">{errors.name}</p>}
          </div>

          {/* E-mail */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })); }}
                className={`w-full bg-gray-100 border rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium ${errors.email ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                placeholder="E-mail"
                disabled={loading}
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.email && <p className="text-[11px] text-red-500 font-semibold ml-1">{errors.email}</p>}
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })); }}
                className={`w-full bg-gray-100 border rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium ${errors.password ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                placeholder="Senha (mínimo 8 caracteres)"
                disabled={loading}
              />
              <button type="button" onClick={() => setShowPassword(s => !s)} tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="space-y-1 px-1">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${strength >= i ? strengthColor[strength] : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className={`text-[11px] font-bold ${strengthText[strength]}`}>Senha {strengthLabel[strength]}</p>
              </div>
            )}

            {errors.password && <p className="text-[11px] text-red-500 font-semibold ml-1">{errors.password}</p>}
          </div>

          {/* Confirmar senha */}
          <div className="space-y-1">
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => { setConfirmPassword(e.target.value); setErrors(p => ({ ...p, confirmPassword: undefined })); }}
                className={`w-full bg-gray-100 border rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-transparent'}`}
                placeholder="Confirmar Senha"
                disabled={loading}
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)} tabIndex={-1}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPassword.length > 0 && password === confirmPassword && (
              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 ml-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Senhas coincidem
              </p>
            )}
            {errors.confirmPassword && <p className="text-[11px] text-red-500 font-semibold ml-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Criar Minha Conta</span>
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-400">
            Já tem uma conta?{' '}
            <button onClick={() => navigate('/login')} className="text-emerald-700 font-bold underline underline-offset-4">
              Entrar
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
