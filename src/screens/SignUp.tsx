import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useMedications } from '../context/MedicationContext';

export default function SignUp() {
  const navigate = useNavigate();
  const { setUserRole } = useMedications();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    setError(null);
    setUserRole('responsavel');
    navigate('/additional-data');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <header className="w-full flex flex-col items-center mb-8">
        <div className="w-32 mb-6">
          <img 
            src="/img/logo_remed.png" 
            alt="ReMed" 
            className="w-full h-auto"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Comece seu cuidado</h1>
          <p className="text-sm text-gray-500 max-w-[250px] mx-auto leading-tight">
            Crie sua conta para nunca mais perder uma dose.
          </p>
        </div>
      </header>

      <main className="w-full max-w-sm flex-grow">

        <form className="space-y-4 mb-8" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100 animate-shake">
              {error}
            </div>
          )}
          <div className="relative">
            <input 
              className="w-full bg-gray-100 border-none rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium" 
              placeholder="Nome Completo" 
              required
            />
            <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="relative">
            <input 
              type="email"
              className="w-full bg-gray-100 border-none rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium" 
              placeholder="E-mail" 
              required
            />
            <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="relative">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium" 
              placeholder="Senha" 
              required
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <div className="relative">
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-100 border-none rounded-2xl p-4 pr-12 text-sm focus:ring-2 focus:ring-emerald-500 shadow-sm font-medium" 
              placeholder="Confirmar Senha" 
              required
            />
            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <button 
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <span>Criar Minha Conta</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center mb-8">
          <p className="text-sm text-gray-400">
            Já tem uma conta? 
            <button 
              onClick={() => navigate('/login')}
              className="text-emerald-700 font-bold underline underline-offset-4 ml-1"
            >
              Entrar
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}
