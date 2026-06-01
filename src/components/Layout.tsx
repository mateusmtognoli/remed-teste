import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, History, User, Bell, type LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface LayoutProps {
  children: React.ReactNode;
  showTopBar?: boolean;
  showBottomNav?: boolean;
}

export default function Layout({ children, showTopBar = true, showBottomNav = true }: LayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#191c1a]">
      {showTopBar && (
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-emerald-50/50">
          <div className="flex justify-between items-center px-6 py-4 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
              <img 
                src="/img/logo_remed.png" 
                alt="ReMed" 
                className="h-8 w-auto cursor-pointer"
                onClick={() => navigate('/dashboard')}
              />
            </div>
            <button 
              className="p-2 hover:bg-emerald-50 rounded-full transition-all relative"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="w-6 h-6 text-emerald-600" />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>
      )}

      <motion.main 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`max-w-2xl mx-auto px-6 ${showTopBar ? 'pt-24' : 'pt-6'} ${showBottomNav ? 'pb-32' : 'pb-6'}`}
      >
        {children}
      </motion.main>

      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 z-50">
          <div className="flex justify-around items-end px-2 pb-6 pt-3 max-w-2xl mx-auto">
            <NavButton to="/dashboard" icon={Home} label="Início" />
            <NavButton to="/add-medication" icon={PlusCircle} label="Adicionar" />
            <NavButton to="/history" icon={History} label="Histórico" />
            <NavButton to="/profile" icon={User} label="Perfil" />
          </div>
        </nav>
      )}
    </div>
  );
}

function NavButton({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => `flex flex-col items-center justify-center gap-1 group transition-all ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}
    >
      <Icon className="w-6 h-6 transition-transform group-active:scale-90" />
      <span className="font-bold text-[10px] tracking-tight uppercase">{label}</span>
    </NavLink>
  );
}
