import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppDataProvider } from './context/AppDataContext';
import MainLayout from './components/Admin/MainLayout';
import PatientsTable from './components/Admin/PatientsManagement';
import AppointmentsPage from './components/Admin/AppointmentsPage';
import CalendarPage from './components/Admin/CalendarPage';
import Dashboard from './components/Admin/Dashboard';
import SettingsPage from './components/Admin/SettingsPage';
import PatientLayout from './components/Patient/PatientLayout';
import PatientDetailsPage from './components/Patient/PatientDetailsPage';
import PatientUpcomingPage from './components/Patient/PatientUpcomingPage';
import PatientHistoryPage from './components/Patient/PatientHistoryPage';
import PatientSettingsPage from './components/Patient/PatientSettingsPage';

function CopyButton({ value, label }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="ml-2 text-gray-400 hover:text-blue-600 focus:outline-none"
      title={copied ? 'Copied!' : 'Copy'}
      aria-label={`Copy ${label}`}
    >
      <svg className="inline w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="3" y="3" width="13" height="13" rx="2"/></svg>
      {copied && <span className="ml-1 text-xs text-green-600">Copied!</span>}
    </button>
  );
}

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
      else navigate(`/patients/${res.user.patientId}/details`);
    } else {
      setError('Invalid email or password');
    }
  };

  if (user) {
    if (user.role === 'Admin') return <Navigate to="/dashboard" />;
    else return <Navigate to={`/patients/${user.patientId}/details`} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-20 blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-15 blur-lg animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="w-full max-w-md mx-4 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4 animate-bounce">🦷</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">DentalCare</h2>
            <p className="text-gray-600">Professional Dental Management System</p>
          </div>
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-shake">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                placeholder="Enter your email"
              />
            </div>
            <div className="transform transition-all duration-300 hover:scale-[1.02]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
                placeholder="Enter your password"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98]"
        >
              Sign In
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center text-sm text-gray-500">
              <p className="mb-2 font-semibold text-gray-700">Demo Credentials:</p>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                  <p className="font-semibold text-blue-700 mb-1">Admin:</p>
                  <p className="text-gray-600">
                    <span>admin@entnt.in</span>
                    <CopyButton value="admin@entnt.in" label="admin email" />
                    <span className="ml-2">/ admin123</span>
                    <CopyButton value="admin123" label="admin password" />
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-md">
                  <p className="font-semibold text-green-700 mb-1">Patient:</p>
                  <p className="text-gray-600">
                    <span>john.doe@entnt.in</span>
                    <CopyButton value="john.doe@entnt.in" label="patient email" />
                    <span className="ml-2">/ patient123</span>
                    <CopyButton value="patient123" label="patient password" />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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
      <Route path="/patients" element={<ProtectedRoute><MainLayout><PatientsTable /></MainLayout></ProtectedRoute>} />
      <Route path="/patients/:id" element={<ProtectedRoute><PatientLayout /></ProtectedRoute>}>
        <Route path="details" element={<PatientDetailsPage />} />
        <Route path="upcoming" element={<PatientUpcomingPage />} />
        <Route path="history" element={<PatientHistoryPage />} />
        <Route path="settings" element={<PatientSettingsPage />} />
      </Route>
      <Route path="/appointments" element={<ProtectedRoute><MainLayout><AppointmentsPage /></MainLayout></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><MainLayout><CalendarPage /></MainLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><MainLayout><SettingsPage /></MainLayout></ProtectedRoute>} />
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
