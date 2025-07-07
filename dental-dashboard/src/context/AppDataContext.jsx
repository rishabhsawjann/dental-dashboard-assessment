import React, { createContext, useContext, useState, useEffect } from 'react';
import SERVICES from '../constants/services';


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pad(n) {
  return n < 10 ? '0' + n : n;
}

const SAMPLE_PATIENTS = [
  { id: "p1", name: "John Doe", dob: "1990-05-10", contact: "1234567890", healthInfo: "No allergies", gender: "Male", bloodGroup: "A+", tags: ["VIP"], notes: "", profilePic: "" },
  { id: "p2", name: "Jane Smith", dob: "1985-08-22", contact: "9876543210", healthInfo: "Diabetic", gender: "Female", bloodGroup: "O-", tags: ["Allergic"], notes: "", profilePic: "" },
  { id: "p3", name: "Michael Brown", dob: "1978-03-15", contact: "5551234567", healthInfo: "Hypertension", gender: "Male", bloodGroup: "B+", tags: [], notes: "", profilePic: "" },
  { id: "p4", name: "Emily Johnson", dob: "1992-12-01", contact: "4445556666", healthInfo: "Asthma", gender: "Female", bloodGroup: "AB+", tags: ["VIP"], notes: "", profilePic: "" },
  { id: "p5", name: "Chris Lee", dob: "1988-07-19", contact: "3332221111", healthInfo: "No known conditions", gender: "Other", bloodGroup: "O+", tags: [], notes: "", profilePic: "" },
  { id: "p6", name: "Olivia Davis", dob: "1995-11-30", contact: "2223334444", healthInfo: "Allergic to penicillin", gender: "Female", bloodGroup: "A-", tags: ["Allergic"], notes: "", profilePic: "" },
  { id: "p7", name: "David Wilson", dob: "1982-04-25", contact: "1112223333", healthInfo: "No allergies", gender: "Male", bloodGroup: "B-", tags: [], notes: "", profilePic: "" },
  { id: "p8", name: "Sophia Martinez", dob: "1999-09-09", contact: "6667778888", healthInfo: "No known conditions", gender: "Female", bloodGroup: "AB-", tags: [], notes: "", profilePic: "" },
  { id: "p9", name: "James Anderson", dob: "1975-06-17", contact: "7778889999", healthInfo: "Heart condition", gender: "Male", bloodGroup: "O-", tags: ["Heart"], notes: "", profilePic: "" },
  { id: "p10", name: "Ava Thomas", dob: "2000-01-05", contact: "8889990000", healthInfo: "No allergies", gender: "Female", bloodGroup: "A+", tags: [], notes: "", profilePic: "" },
  { id: "p11", name: "William Taylor", dob: "1987-10-13", contact: "9990001111", healthInfo: "Smoker", gender: "Male", bloodGroup: "B+", tags: ["Smoker"], notes: "", profilePic: "" },
  { id: "p12", name: "Mia Moore", dob: "1993-02-28", contact: "0001112222", healthInfo: "No known conditions", gender: "Female", bloodGroup: "O+", tags: [], notes: "", profilePic: "" },
  { id: "p13", name: "Lucas White", dob: "1983-03-12", contact: "1010101010", healthInfo: "No allergies", gender: "Male", bloodGroup: "A-", tags: [], notes: "", profilePic: "" },
  { id: "p14", name: "Ella Harris", dob: "1991-07-23", contact: "2020202020", healthInfo: "Asthma", gender: "Female", bloodGroup: "B+", tags: [], notes: "", profilePic: "" },
  { id: "p15", name: "Benjamin Clark", dob: "1986-11-05", contact: "3030303030", healthInfo: "No known conditions", gender: "Male", bloodGroup: "AB+", tags: [], notes: "", profilePic: "" },
  { id: "p16", name: "Grace Lewis", dob: "1994-04-18", contact: "4040404040", healthInfo: "Allergic to latex", gender: "Female", bloodGroup: "O-", tags: ["Allergic"], notes: "", profilePic: "" },
  { id: "p17", name: "Henry Walker", dob: "1989-09-30", contact: "5050505050", healthInfo: "No allergies", gender: "Male", bloodGroup: "A+", tags: [], notes: "", profilePic: "" },
  { id: "p18", name: "Chloe Hall", dob: "1996-02-14", contact: "6060606060", healthInfo: "No known conditions", gender: "Female", bloodGroup: "B-", tags: [], notes: "", profilePic: "" },
  { id: "p19", name: "Jack Young", dob: "1984-06-21", contact: "7070707070", healthInfo: "Hypertension", gender: "Male", bloodGroup: "AB-", tags: [], notes: "", profilePic: "" },
  { id: "p20", name: "Lily King", dob: "1997-10-11", contact: "8080808080", healthInfo: "No allergies", gender: "Female", bloodGroup: "O+", tags: [], notes: "", profilePic: "" },
  { id: "p21", name: "Samuel Wright", dob: "1981-01-29", contact: "9090909090", healthInfo: "No known conditions", gender: "Male", bloodGroup: "A+", tags: [], notes: "", profilePic: "" },
  { id: "p22", name: "Zoe Scott", dob: "1998-08-08", contact: "1112223334", healthInfo: "No allergies", gender: "Female", bloodGroup: "B+", tags: [], notes: "", profilePic: "" },
  { id: "p23", name: "Daniel Green", dob: "1980-12-17", contact: "2223334445", healthInfo: "No known conditions", gender: "Male", bloodGroup: "O-", tags: [], notes: "", profilePic: "" },
  { id: "p24", name: "Sofia Adams", dob: "1992-03-03", contact: "3334445556", healthInfo: "No allergies", gender: "Female", bloodGroup: "A-", tags: [], notes: "", profilePic: "" },
  { id: "p25", name: "Matthew Baker", dob: "1987-05-27", contact: "4445556667", healthInfo: "No known conditions", gender: "Male", bloodGroup: "B-", tags: [], notes: "", profilePic: "" },
];

const today = new Date('2025-07-02T00:00:00');
const year = 2025;
const patientIds = SAMPLE_PATIENTS.map(p => p.id);
const titles = [
  "Dental Cleaning", "Cavity Filling", "Checkup", "Tooth Extraction", "Pain Relief", "Root Canal", "Scaling & Polishing", "Teeth Whitening"
];
const descriptions = [
  "Routine cleaning", "Filling molar", "Annual checkup", "Wisdom tooth extraction", "Tooth pain relief", "Root canal treatment", "Scaling and polishing", "Cosmetic whitening"
];

const patientVisitDistribution = [
  ...Array(3).fill(getRandomInt(12, 15)), 
  ...Array(7).fill(getRandomInt(7, 11)),  
  ...Array(8).fill(getRandomInt(4, 6)),   
  ...Array(patientIds.length - 18).fill(getRandomInt(1, 3)), 
];

let incidentId = 1;
const SAMPLE_INCIDENTS = [];
const appointmentDates = [];
for (let i = 0; i < patientIds.length; i++) {
  const visits = patientVisitDistribution[i] || getRandomInt(1, 3);
  for (let v = 0; v < visits; v++) {
    const month = getRandomInt(0, 11);
    const day = getRandomInt(1, 28);
    const hour = getRandomInt(9, 16);
    const apptDate = new Date(year, month, day, hour, 0, 0);
    appointmentDates.push(apptDate);
    const titleIdx = getRandomInt(0, titles.length - 1);
    const title = titles[titleIdx];
    const service = SERVICES.find(s => s.label === title);
    SAMPLE_INCIDENTS.push({
      id: `i${incidentId++}`,
      patientId: patientIds[i],
      title,
      description: descriptions[titleIdx],
      comments: "",
      appointmentDate: `${apptDate.getFullYear()}-${pad(apptDate.getMonth() + 1)}-${pad(apptDate.getDate())}T${pad(apptDate.getHours())}:00:00`,
      cost: service ? service.price : 0,
      status: apptDate < today ? "Completed" : "Pending",
      files: [],
      notes: "",
      nextDate: "",
      locked: false
    });
  }
}

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

  
  const addPatient = (patient) => {
    setPatients(prev => [...prev, { ...patient, id: 'p' + Date.now() }]);
  };
  const updatePatient = (id, updates) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };
  const deletePatient = (id) => {
    setPatients(prev => prev.filter(p => p.id !== id));
    setIncidents(prev => prev.filter(i => i.patientId !== id)); 
  };

  
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