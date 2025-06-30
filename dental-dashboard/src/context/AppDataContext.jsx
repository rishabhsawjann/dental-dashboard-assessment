import React, { createContext, useContext, useState, useEffect } from 'react';

const SAMPLE_PATIENTS = [
  {
    id: 'p1',
    name: 'John Doe',
    dob: '1990-05-10',
    contact: '1234567890',
    healthInfo: 'No allergies'
  }
];

const SAMPLE_INCIDENTS = [
  {
    id: 'i1',
    patientId: 'p1',
    title: 'Toothache',
    description: 'Upper molar pain',
    comments: 'Sensitive to cold',
    appointmentDate: '2025-07-01T10:00:00',
    cost: 80,
    status: 'Completed',
    files: [
      { name: 'invoice.pdf', url: '' },
      { name: 'xray.png', url: '' }
    ]
  }
];

const AppDataContext = createContext();

export function AppDataProvider({ children }) {
  const [patients, setPatients] = useState(() => {
    const stored = localStorage.getItem('patients');
    return stored ? JSON.parse(stored) : SAMPLE_PATIENTS;
  });
  const [incidents, setIncidents] = useState(() => {
    const stored = localStorage.getItem('incidents');
    return stored ? JSON.parse(stored) : SAMPLE_INCIDENTS;
  });

  useEffect(() => {
    localStorage.setItem('patients', JSON.stringify(patients));
  }, [patients]);
  useEffect(() => {
    localStorage.setItem('incidents', JSON.stringify(incidents));
  }, [incidents]);

  // Patient CRUD
  const addPatient = (patient) => {
    setPatients(prev => [...prev, { ...patient, id: 'p' + Date.now() }]);
  };
  const updatePatient = (id, updates) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setIncidents(prev => prev.filter(i => i.patientId !== id)); // Remove related incidents
  };

  // Incident CRUD
  const addIncident = (incident) => {
    setIncidents(prev => [...prev, { ...incident, id: 'i' + Date.now() }]);
  };
  const updateIncident = (id, updates) => {
    setIncidents(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };
  const deleteIncident = (id) => {
    setIncidents(prev => prev.filter(i => i.id !== id));
  };

  return (
    <AppDataContext.Provider value={{
      patients, addPatient, updatePatient, deletePatient,
      incidents, addIncident, updateIncident, deleteIncident
    }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
} 