import { createContext, useContext, useState } from 'react';
import type { HardcodedUser, UserRole } from '../types';

export const HARDCODED_USERS: HardcodedUser[] = [
  { username: 'gov_admin',      password: 'gov123',  role: 'government',   id: 'GOV001', name: 'Health Ministry' },
  { username: 'manufacturer1',  password: 'mfg123',  role: 'manufacturer', id: 'MFG001', name: 'PharmaCorp Ltd' },
  { username: 'pharmacy1',      password: 'pha123',  role: 'pharmacy',     id: 'PHA001', name: 'City Pharmacy' },
  { username: 'doctor1',        password: 'doc123',  role: 'doctor',       id: 'DOC001', name: 'Dr. Sarah Johnson' },
  { username: 'citizen1',       password: 'cit123',  role: 'citizen',      id: 'CIT001', name: 'John Doe' },
];

interface AuthContextValue {
  user: HardcodedUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<HardcodedUser | null>(null);

  const login = (username: string, password: string): boolean => {
    const found = HARDCODED_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser(found);
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export const ROLE_COLOR: Record<UserRole, string> = {
  government:   '#2563eb',
  manufacturer: '#7c3aed',
  pharmacy:     '#059669',
  doctor:       '#dc2626',
  citizen:      '#d97706',
};

export const ROLE_LABEL: Record<UserRole, string> = {
  government:   'Government',
  manufacturer: 'Manufacturer',
  pharmacy:     'Pharmacy',
  doctor:       'Doctor',
  citizen:      'Citizen',
};
