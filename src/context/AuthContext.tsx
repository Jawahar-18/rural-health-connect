import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/mockData';
import { apiService } from '../services/apiService';

interface AuthContextType {
  currentUser: User;
  switchRole: (role: UserRole) => void;
  setUser: (user: User) => void;
  availableDemoUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_CREDENTIALS: Record<UserRole, { username: string; pass: string }> = {
  HEALTH_WORKER: { username: 'savita.kamble', pass: 'Password@123' },
  DOCTOR: { username: 'dr.deshmukh', pass: 'Password@123' },
  FACILITY_ADMIN: { username: 'dr.kulkarni', pass: 'Password@123' },
  DISTRICT_ADMIN: { username: 'dr.pawar', pass: 'Password@123' },
  PATIENT: { username: 'anandi.patil', pass: 'Password@123' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(
    DEMO_USERS.find(u => u.role === 'HEALTH_WORKER') || DEMO_USERS[0]
  );

  const authenticateWithBackend = async (role: UserRole) => {
    const creds = ROLE_CREDENTIALS[role];
    if (creds) {
      await apiService.login(creds.username, creds.pass);
      apiService.syncWithBackend();
    }
  };

  useEffect(() => {
    authenticateWithBackend(currentUser.role);
  }, []);

  const switchRole = (role: UserRole) => {
    const found = DEMO_USERS.find(u => u.role === role);
    if (found) {
      setCurrentUser(found);
      authenticateWithBackend(role);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchRole, setUser: setCurrentUser, availableDemoUsers: DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

