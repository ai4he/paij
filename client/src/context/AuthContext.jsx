import { createContext, useState, useEffect } from 'react';
import * as api from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('journalUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (pin) => {
    const userData = await api.login(pin);
    setUser(userData);
    localStorage.setItem('journalUser', JSON.stringify(userData));
    return userData;
  };

  const register = async () => {
    const userData = await api.register();
    setUser(userData);
    localStorage.setItem('journalUser', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('journalUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
