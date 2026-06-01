import React from 'react';
import { motion } from 'motion/react';

export default function LoadingScreen({ message }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-32 mb-8">
          <img 
            src="/img/logo_remed.png" 
            alt="ReMed" 
            className="w-full h-auto"
          />
        </div>
        
        <div className="relative w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity
            }}
            className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
          />
        </div>
        
        <p className="mt-4 text-slate-400 font-bold text-[10px] tracking-widest uppercase animate-pulse">
          {message ?? 'Carregando seu cuidado...'}
        </p>
      </motion.div>
    </div>
  );
}
