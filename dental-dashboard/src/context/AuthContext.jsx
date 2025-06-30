import React, { createContext, useContext, useState, useEffect } from 'react';

const USERS = [
  { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
  { id: '2', role: 'Patient', email: 'john@entnt.in', password: 'patient123', patientId: 'p1' },
];

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('authUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('authUser');
    }
  }, [user]);

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      return { success: true, user: found };
    }
    return { success: false };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 