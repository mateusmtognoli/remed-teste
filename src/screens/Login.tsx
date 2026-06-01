import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ChevronRight, Smartphone, Key, ArrowLeft, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import LoadingScreen from '../components/LoadingScreen';
import { useMedications } from '../context/MedicationContext';

export default function Login() {
  const navigate = useNavigate();
  const { pairDevice } = useMedications();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Pairing mode states
  const [isPairingMode, setIsPairingMode] = useState(false);
  const [pairingCode, setPairingCode] = useState('');
  const [pairingError, setPairingError] = useState<string | null>(null);
  const [pairingSuccess, setPairingSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isPairingMode) {
      setPairingError(null);
      const res = pairDevice(pairingCode);
      if (res.success) {
        setPairingSuccess(`Emparelhado com sucesso a ${res.dependentName}!`);
        setLoading(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setPairingError(res.error || 'Código inválido');
      }
      return;
    }

    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const handlePairingCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.toUpperCase();
    // Auto-formatting (add hyphen after three letters)
    val = val.replace(/[^A-Z0-9]/g, '');
    if (val.length > 3) {
      val = val.slice(0, 3) + '-' + val.slice(3, 6);
    }
    setPairingCode(val.slice(0, 7));
  };

  if (loading) {
    return <LoadingScreen message={pairingSuccess ? pairingSuccess : "Acessando aplicativo..."} />;
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
            <img 
              src="/img/logo_remed.png" 
              alt="ReMed" 
              className="w-48 h-auto object-contain"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            {isPairingMode ? "Emparelhar Celular" : "Bem-vindo de volta"}
          </h1>
          <p className="text-sm text-gray-500 max-w-[280px] mx-auto leading-relaxed">
            {isPairingMode 
              ? "Acesse o aplicativo do seu dependente apenas como visualização digitando o código."
              : "Acesse sua conta para gerenciar seus medicamentos com facilidade."
            }
          </p>
        </header>

        {isPairingMode ? (
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-emerald-800 tracking-widest uppercase ml-1">CÓDIGO DE EMPARELHAMENTO</label>
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
                Peça ao responsável para gerar este código no perfil administrativo dele (Telas "Gerenciar Acessos" ou "Perfil").
              </p>
            </div>

            {pairingError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs font-bold border border-red-100">
                {pairingError}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all hover:bg-emerald-700 outline-none"
            >
              <span>Emparelhar Dispositivo</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPairingMode(false);
                setPairingError(null);
                setPairingCode('');
              }}
              className="w-full py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-slate-50 outline-none"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Login Responsável</span>
            </button>
          </form>
        ) : (
          <form className="w-full space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase ml-1">E-MAIL</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  placeholder="nome@exemplo.com"
                  className="w-full h-14 pl-12 pr-4 bg-gray-100/50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-700 placeholder-gray-400 transition-all hover:bg-gray-200/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 tracking-widest uppercase ml-1">SENHA</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full h-14 pl-12 pr-4 bg-gray-100/50 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 text-gray-700 placeholder-gray-400 transition-all hover:bg-gray-200/50"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between items-center px-1">
              <label 
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2 cursor-pointer group"
              >
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
              className="w-full py-4 bg-emerald-500 text-white font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-[0.98] transition-all hover:bg-emerald-600 outline-none mt-2"
            >
              <span>Entrar</span>
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsPairingMode(true);
                  setPairingError(null);
                  setPairingCode('');
                }}
                className="w-full py-3.5 bg-emerald-50 text-emerald-700 font-extrabold rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-emerald-100 outline-none"
              >
                <Smartphone className="w-5 h-5 text-emerald-600" />
                <span>Emparelhar Celular (Dependente)</span>
              </button>
            </div>
          </form>
        )}

        <footer className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Ainda não tem conta? 
            <button 
              onClick={() => navigate('/signup')}
              className="text-emerald-500 font-bold hover:text-emerald-700 transition-colors ml-1"
            >
              Criar Conta
            </button>
          </p>
        </footer>
      </motion.div>
    </div>
  );
}
