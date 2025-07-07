import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import {
  Settings as SettingsIcon,
  User2,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  MapPin,
  Shield,
  Edit3,
  Bell,
  Eye,
  ChevronRight,
  LogOut,
  CheckCircle2,
  X,
  Users,
  Activity,
} from 'lucide-react';

function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function EditProfileModal({ open, onClose, admin, onSave }) {
  const [form, setForm] = React.useState({
    contact: admin?.contact || '',
    department: admin?.department || '',
    address: admin?.address || '',
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setForm({
        contact: admin?.contact || '',
        department: admin?.department || '',
        address: admin?.address || '',
      });
      setError('');
    }
  }, [open, admin]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.contact.trim() || !form.department.trim()) {
      setError('Phone and Department are required.');
      return;
    }
    setSaving(true);
    onSave(form);
    setSaving(false);
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeInUp transform transition-all duration-300 hover:scale-[1.02]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none transition-all duration-200 hover:rotate-90" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Edit Profile</h3>
        <p className="text-gray-600 mb-4">Update your contact details below.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              name="contact"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
              value={form.contact}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <input
              name="department"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
              value={form.department}
              onChange={handleChange}
              required
              placeholder="Enter department"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
            <input
              name="address"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:shadow-md"
              value={form.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>
          {error && <div className="text-red-600 text-sm mb-2 animate-pulse">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function NotificationModal({ open, onClose, subscribed, onChange }) {
  const [checked, setChecked] = React.useState(subscribed);
  React.useEffect(() => { if (open) setChecked(subscribed); }, [open, subscribed]);
  function handleSave() { onChange(checked); onClose(); }
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeInUp transform transition-all duration-300 hover:scale-[1.02]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none transition-all duration-200 hover:rotate-90" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Email Notifications</h3>
        <p className="text-gray-600 mb-6">Would you like to receive system alerts and updates via email?</p>
        <div className="flex items-center gap-3 mb-6">
          <input
            id="email-subscribe"
            type="checkbox"
            checked={checked}
            onChange={e => setChecked(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-all duration-200 hover:scale-110"
          />
          <label htmlFor="email-subscribe" className="text-gray-800 text-lg font-medium">
            Subscribe to email notifications
          </label>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function PrivacyModal({ open, onClose, accepted, onAccept }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeInUp transform transition-all duration-300 hover:scale-[1.02]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none transition-all duration-200 hover:rotate-90" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
        <h3 className="text-2xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Privacy & Data Protection</h3>
        <p className="text-gray-600 mb-6">
          As an administrator, you have access to sensitive patient data. We take data protection seriously. All personal and medical data is securely stored and protected with industry-standard encryption. Access is logged and monitored for security purposes.
        </p>
        {accepted ? (
          <div className="text-green-600 font-semibold text-center mb-4 animate-pulse">You have accepted our privacy policy.</div>
        ) : null}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
          >
            Close
          </button>
          {!accepted && (
            <button
              type="button"
              onClick={() => { onAccept(); onClose(); }}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Agree & Accept
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { patients, incidents } = useAppData();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(() => {
    const stored = localStorage.getItem('adminEmailSubscribed');
    return stored ? JSON.parse(stored) : false;
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(() => {
    const stored = localStorage.getItem('adminPrivacyAccepted');
    return stored ? JSON.parse(stored) : false;
  });

  
  const adminData = {
    id: user?.id,
    name: user?.name || 'Admin',
    email: user?.email || 'admin@entnt.in',
    contact: '+91 98765 43210',
    department: 'Administration',
    address: '123 Dental Street, City, State',
    role: user?.role || 'Admin',
    joinDate: '2023-01-15'
  };

  const totalPatients = patients.length;
  const totalAppointments = incidents.length;
  const memberSince = formatDate(adminData.joinDate);

  const info = [
    {
      icon: <Mail className="w-5 h-5 text-blue-600" />, label: 'Email', value: adminData.email,
    },
    {
      icon: <Phone className="w-5 h-5 text-blue-600" />, label: 'Phone', value: adminData.contact,
    },
    {
      icon: <CalendarIcon className="w-5 h-5 text-blue-600" />, label: 'Join Date', value: memberSince,
    },
  ];
  
  const account = [
    {
      icon: <MapPin className="w-5 h-5 text-blue-600" />, label: 'Address', value: adminData.address,
    },
    {
      icon: <Users className="w-5 h-5 text-blue-600" />, label: 'Total Patients', value: totalPatients,
    },
    {
      icon: <Activity className="w-5 h-5 text-blue-600" />, label: 'Total Appointments', value: totalAppointments,
    },
    {
      icon: <Shield className="w-5 h-5 text-green-600" />, label: 'Account Status', value: <span className="text-green-600 font-semibold flex items-center gap-1">Active <CheckCircle2 className="w-4 h-4" /></span>,
    },
  ];

  const actions = [
    { icon: <Edit3 className="w-5 h-5 text-blue-600" />, label: 'Edit Profile', onClick: () => setShowEditModal(true) },
    { icon: <Bell className="w-5 h-5 text-blue-600" />, label: 'Notification Settings', onClick: () => setShowNotificationModal(true) },
    { icon: <Eye className="w-5 h-5 text-blue-600" />, label: 'Privacy Settings', onClick: () => setShowPrivacyModal(true) },
  ];

  function handleProfileSave(form) {
    
    console.log('Saving admin profile:', form);
    setShowEditModal(false);
  }

  function handleNotificationChange(val) {
    setEmailSubscribed(val);
    localStorage.setItem('adminEmailSubscribed', JSON.stringify(val));
  }

  function handlePrivacyAccept() {
    setPrivacyAccepted(true);
    localStorage.setItem('adminPrivacyAccepted', JSON.stringify(true));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-2 px-1">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-3 mb-2 animate-fadeInUp">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
            <SettingsIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">Settings</h1>
            <p className="text-gray-600 text-base">Manage your account, profile, and preferences</p>
          </div>
        </div>
       
        <div className="relative rounded-2xl overflow-hidden mb-2 shadow-lg border border-gray-200 transform hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 flex flex-col sm:flex-row items-center gap-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            <div className="relative">
              <div className="w-18 h-18 rounded-full border-4 border-white overflow-hidden bg-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
                <User2 className="w-12 h-12 text-blue-200" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-3 flex flex-col gap-1.5 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:bg-white/90">
            <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2"><User2 className="w-5 h-5 text-blue-600 animate-pulse" /> Personal Information</h2>
            {info.map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 hover:bg-gray-50/50 rounded-lg p-1.5 transition-all duration-200">
                <span className="transform hover:scale-110 transition-transform duration-200">{icon}</span>
                <span className="text-gray-700 font-medium w-32">{label}:</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg p-3 flex flex-col gap-1.5 transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl hover:bg-white/90">
            <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-600 animate-pulse" /> Account Details</h2>
            {account.map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-2 hover:bg-gray-50/50 rounded-lg p-1.5 transition-all duration-200">
                <span className="transform hover:scale-110 transition-transform duration-200">{icon}</span>
                <span className="text-gray-700 font-medium w-32">{label}:</span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-2">
          <div className="flex flex-col gap-1.5">
            {actions.map(({ icon, label, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="w-full flex items-center justify-between px-4 py-1.5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 text-gray-900 font-medium text-lg group transform hover:scale-[1.02] hover:-translate-y-1"
              >
                <span className="flex items-center gap-2">{icon} {label}</span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-2">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-1.5 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-200 shadow-lg text-red-600 font-semibold text-lg hover:from-red-100 hover:to-pink-100 transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>
      
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 relative animate-fadeInUp transform transition-all duration-300 hover:scale-[1.02]">
            <button onClick={() => setShowLogoutModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl font-bold focus:outline-none transition-all duration-200 hover:rotate-90" aria-label="Close">
              <X className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center gap-3 mb-6">
              <LogOut className="w-12 h-12 text-red-600 bg-red-50 rounded-full p-2 mb-2 animate-pulse" />
              <h3 className="text-2xl font-bold text-red-600 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">Sign Out</h3>
              <p className="text-gray-600 text-center">Are you sure you want to sign out of your account?</p>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                onClick={logout}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
      
      <EditProfileModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        admin={adminData}
        onSave={handleProfileSave}
      />
      <NotificationModal
        open={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        subscribed={emailSubscribed}
        onChange={handleNotificationChange}
      />
      <PrivacyModal
        open={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        accepted={privacyAccepted}
        onAccept={handlePrivacyAccept}
      />
    </div>
  );
} 