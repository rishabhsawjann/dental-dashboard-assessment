import React, { createContext, useContext, useState, useEffect } from 'react';

const USERS = [
  { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
  { id: '2', role: 'Patient', email: 'john.doe@entnt.in', password: 'patient123', patientId: 'p1' },
  { id: '3', role: 'Patient', email: 'jane.smith@entnt.in', password: 'patient123', patientId: 'p2' },
  { id: '4', role: 'Patient', email: 'michael.brown@entnt.in', password: 'patient123', patientId: 'p3' },
  { id: '5', role: 'Patient', email: 'emily.johnson@entnt.in', password: 'patient123', patientId: 'p4' },
  { id: '6', role: 'Patient', email: 'chris.lee@entnt.in', password: 'patient123', patientId: 'p5' },
  { id: '7', role: 'Patient', email: 'olivia.davis@entnt.in', password: 'patient123', patientId: 'p6' },
  { id: '8', role: 'Patient', email: 'david.wilson@entnt.in', password: 'patient123', patientId: 'p7' },
  { id: '9', role: 'Patient', email: 'sophia.martinez@entnt.in', password: 'patient123', patientId: 'p8' },
  { id: '10', role: 'Patient', email: 'james.anderson@entnt.in', password: 'patient123', patientId: 'p9' },
  { id: '11', role: 'Patient', email: 'ava.thomas@entnt.in', password: 'patient123', patientId: 'p10' },
  { id: '12', role: 'Patient', email: 'william.taylor@entnt.in', password: 'patient123', patientId: 'p11' },
  { id: '13', role: 'Patient', email: 'mia.moore@entnt.in', password: 'patient123', patientId: 'p12' },
  { id: '14', role: 'Patient', email: 'lucas.white@entnt.in', password: 'patient123', patientId: 'p13' },
  { id: '15', role: 'Patient', email: 'ella.harris@entnt.in', password: 'patient123', patientId: 'p14' },
  { id: '16', role: 'Patient', email: 'benjamin.clark@entnt.in', password: 'patient123', patientId: 'p15' },
  { id: '17', role: 'Patient', email: 'grace.lewis@entnt.in', password: 'patient123', patientId: 'p16' },
  { id: '18', role: 'Patient', email: 'henry.walker@entnt.in', password: 'patient123', patientId: 'p17' },
  { id: '19', role: 'Patient', email: 'chloe.hall@entnt.in', password: 'patient123', patientId: 'p18' },
  { id: '20', role: 'Patient', email: 'jack.young@entnt.in', password: 'patient123', patientId: 'p19' },
  { id: '21', role: 'Patient', email: 'lily.king@entnt.in', password: 'patient123', patientId: 'p20' },
  { id: '22', role: 'Patient', email: 'samuel.wright@entnt.in', password: 'patient123', patientId: 'p21' },
  { id: '23', role: 'Patient', email: 'zoe.scott@entnt.in', password: 'patient123', patientId: 'p22' },
  { id: '24', role: 'Patient', email: 'daniel.green@entnt.in', password: 'patient123', patientId: 'p23' },
  { id: '25', role: 'Patient', email: 'sofia.adams@entnt.in', password: 'patient123', patientId: 'p24' },
  { id: '26', role: 'Patient', email: 'matthew.baker@entnt.in', password: 'patient123', patientId: 'p25' },
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