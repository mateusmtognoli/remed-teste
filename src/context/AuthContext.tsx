import React, { createContext, useContext, useState } from 'react';

interface LocalUser {
  id: string;
  email: string;
  user_metadata: { name: string };
}

interface AuthContextType {
  user: LocalUser | null;
  session: null;
  authLoading: boolean;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const EMPARELHADO_EMAIL = 'emparelhado@remed.local';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(() => {
    if (localStorage.getItem('remed_logged_in') !== 'true') return null;
    return {
      id: 'local',
      email: localStorage.getItem('remed_user_email') || '',
      user_metadata: { name: localStorage.getItem('remed_user_name') || '' },
    };
  });

  const signIn = (email: string, name?: string) => {
    const isEmparelhado = email === EMPARELHADO_EMAIL;
    const userNameKey = `remed_user_name_${email}`;

    if (!isEmparelhado) {
      // Persiste o nome escopado por email no cadastro
      if (name) localStorage.setItem(userNameKey, name);

      // Carrega o nome específico desta conta
      const resolvedName = name
        ?? localStorage.getItem(userNameKey)
        ?? email.split('@')[0];

      localStorage.setItem('remed_logged_in', 'true');
      localStorage.setItem('remed_user_email', email);
      localStorage.setItem('remed_current_user', email);
      localStorage.setItem('remed_user_name', resolvedName);

      setUser({ id: 'local', email, user_metadata: { name: resolvedName } });
    } else {
      // Emparelhamento: não altera dados da conta responsável
      localStorage.setItem('remed_logged_in', 'true');
      localStorage.setItem('remed_user_email', email);
      const existingName = localStorage.getItem('remed_user_name') ?? '';
      setUser({ id: 'local', email, user_metadata: { name: existingName } });
    }
  };

  const signOut = () => {
    localStorage.removeItem('remed_logged_in');
    localStorage.removeItem('remed_current_user');
    localStorage.removeItem('remed_user_email');
    localStorage.removeItem('remed_user_name');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, session: null, authLoading: false, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
