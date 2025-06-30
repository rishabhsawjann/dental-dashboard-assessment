import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import MainLayout from './components/MainLayout';
import PatientsTable from './components/PatientsTable';
import IncidentManagement from './components/IncidentManagement';
import AppointmentsPage from './components/AppointmentsPage';
import CalendarPage from './components/CalendarPage';
import Dashboard from './components/Dashboard';

function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      if (res.user.role === 'Admin') navigate('/dashboard');
      else navigate('/patients/' + res.user.patientId);
    } else {
      setError('Invalid email or password');
    }
  };

  if (user) {
    // Already logged in, redirect
    if (user.role === 'Admin') return <Navigate to="/dashboard" />;
    else return <Navigate to={`/patients/${user.patientId}`} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🦷</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">DentalCare</h2>
            <p className="text-gray-600">Professional Dental Management System</p>
          </div>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center text-sm text-gray-500">
              <p className="mb-2">Demo Credentials:</p>
              <div className="space-y-1 text-xs">
                <p><strong>Admin:</strong> admin@entnt.in / admin123</p>
                <p><strong>Patient:</strong> john@entnt.in / patient123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PatientsPage() {
  return <PatientsTable />;
}
function PatientPage() {
  const { id } = useParams();
  return <IncidentManagement patientId={id} />;
}

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><MainLayout><Dashboard /></MainLayout></ProtectedRoute>} />
      <Route path="/patients" element={<ProtectedRoute><MainLayout><PatientsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/patients/:id" element={<ProtectedRoute><MainLayout><PatientPage /></MainLayout></ProtectedRoute>} />
      <Route path="/appointments" element={<ProtectedRoute><MainLayout><AppointmentsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><MainLayout><CalendarPage /></MainLayout></ProtectedRoute>} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppDataProvider>
    </AuthProvider>
  );
}

export default App;
