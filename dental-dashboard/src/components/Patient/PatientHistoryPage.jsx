import React, { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Search, 
  Filter, 
  TrendingUp, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  CalendarDays,
  Award,
  Heart,
  Zap,
  ChevronDown,
  ChevronUp,
  User2,
  Brush,
  Syringe,
  Wrench,
  Sparkles,
  Smile,
  Camera,
  Droplets,
  Pill,
  Stethoscope,
  Crown,
  Pen,
  History,
  X
} from 'lucide-react';
import SERVICES from '../../constants/services';

const STATUS_COLORS = {
  Completed: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-200 shadow-sm',
  Cancelled: 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-200 shadow-sm',
  'In Progress': 'bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-200 shadow-sm',
  Pending: 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 shadow-sm',
};

const STATUS_ICONS = {
  Completed: <CheckCircle2 className="w-4 h-4" />,
  Cancelled: <XCircle className="w-4 h-4" />,
  'In Progress': <Activity className="w-4 h-4" />,
  Pending: <AlertCircle className="w-4 h-4" />,
};

const lucideIconMap = {
  Sparkles,
  Tooth: Smile,
  Brush,
  Wrench,
  Smile,
  Camera,
  Droplets,
  Pill,
  Stethoscope,
  Crown,
  Bone: Smile,
  Pencil: Pen,
};

function getTreatmentIcon(title) {
  const service = SERVICES.find(s => s.label === title);
  return service && lucideIconMap[service.icon] ? 
    React.createElement(lucideIconMap[service.icon], { className: 'w-5 h-5 text-blue-500' }) : 
    <Smile className="w-5 h-5 text-blue-500" />;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
  return `${Math.floor(diffInDays / 365)}y ago`;
}

function AppointmentDetailModal({ open, onClose, appointment }) {
  if (!open || !appointment) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeInUp border border-gray-100">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-xl font-bold focus:outline-none transition-colors duration-200" aria-label="Close">
          <X className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-sky-100 to-indigo-100 rounded-xl">
          <span className="text-2xl">{getTreatmentIcon(appointment.title)}</span>
        </div>
          <div>
            <div className="font-bold text-lg text-slate-900">{appointment.title}</div>
            <div className="text-xs text-slate-500">{formatDate(appointment.appointmentDate)} at {formatTime(appointment.appointmentDate)}</div>
          </div>
        </div>
        <div className="mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[appointment.status]} flex items-center gap-1 w-fit`}>
            {STATUS_ICONS[appointment.status]}
            {appointment.status}
          </span>
        </div>
        <div className="mb-3 text-slate-700 text-sm">
          <strong>Description:</strong> {appointment.description || 'No description provided.'}
        </div>
        <div className="mb-3 text-slate-700 text-sm">
          <strong>Cost:</strong> <span className="text-emerald-600 font-semibold">${parseFloat(appointment.cost || 0).toFixed(2)}</span>
        </div>
        <div className="mb-3 text-slate-700 text-sm">
          <strong>Time ago:</strong> {getTimeAgo(appointment.appointmentDate)}
        </div>
        {appointment.notes && (
          <div className="p-3 bg-gradient-to-r from-sky-50 to-indigo-50 rounded-lg border border-sky-100 shadow-sm">
            <p className="text-sm text-sky-800">
              <strong>Notes:</strong> {appointment.notes}
            </p>
          </div>
        )}
        {appointment.files && appointment.files.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Attached Files ({appointment.files.length})
            </h4>
            <div className="space-y-2">
              {appointment.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-700">{file.name}</span>
                    <span className="text-xs text-slate-500">({(file.size / 1024).toFixed(1)}KB)</span>
                  </div>
                  <button
                    onClick={() => window.open(file.url, '_blank')}
                    className="px-2 py-1 text-xs bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors duration-200"
                    title="View file"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PatientHistoryPage() {
  const { user } = useAuth();
  const { patients, incidents } = useAppData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const currentPatient = patients.find(p => p.id === user?.patientId);

  const pastAppointments = useMemo(() => {
    const now = new Date();
    return incidents
      .filter(i => i.patientId === currentPatient?.id && new Date(i.appointmentDate) < now)
      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
  }, [incidents, currentPatient]);

  const filteredAppointments = useMemo(() => {
    let filtered = pastAppointments.filter(appointment => {
      const matchesSearch = appointment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           appointment.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'cost') {
      filtered.sort((a, b) => parseFloat(b.cost) - parseFloat(a.cost));
    } else {
      filtered.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
    }

    return filtered;
  }, [pastAppointments, searchTerm, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const totalAppointments = pastAppointments.length;
    const completedAppointments = pastAppointments.filter(a => a.status === 'Completed').length;
    const totalSpent = pastAppointments
      .filter(a => a.status === 'Completed')
      .reduce((sum, a) => sum + parseFloat(a.cost || 0), 0);
    const uniqueTreatments = new Set(pastAppointments.map(a => a.title)).size;
    const averageCost = completedAppointments > 0 ? totalSpent / completedAppointments : 0;
    
    return {
      totalAppointments,
      completedAppointments,
      totalSpent,
      uniqueTreatments,
      averageCost,
      completionRate: totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0
    };
  }, [pastAppointments]);

  const mostCommonTreatment = useMemo(() => {
    const treatmentCounts = {};
    pastAppointments.forEach(appointment => {
      treatmentCounts[appointment.title] = (treatmentCounts[appointment.title] || 0) + 1;
    });
    return Object.entries(treatmentCounts)
      .sort(([,a], [,b]) => b - a)[0] || ['None', 0];
  }, [pastAppointments]);

  function openDetailModal(appointment) {
    setSelectedAppointment(appointment);
    setShowDetailModal(true);
  }

  function closeDetailModal() {
    setShowDetailModal(false);
    setSelectedAppointment(null);
  }

  if (!currentPatient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center text-slate-500">
          <div className="p-4 bg-white rounded-full shadow-lg mb-4 w-fit mx-auto">
            <User2 className="w-16 h-16 text-slate-300" />
          </div>
          <p>Patient information not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <History className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-sky-800 to-indigo-800 bg-clip-text text-transparent">Appointment History</h1>
            <p className="text-slate-600 text-base">Your complete dental journey and treatment records</p>
          </div>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 shadow-lg border border-sky-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium">Total Visits</p>
                <p className="text-xl font-bold text-sky-700">{stats.totalAppointments}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-sky-200 to-blue-200 rounded-lg flex items-center justify-center shadow-sm">
                <Calendar className="w-5 h-5 text-sky-700" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 shadow-lg border border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium">Completed</p>
                <p className="text-xl font-bold text-emerald-700">{stats.completedAppointments}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-lg flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-600">
              {stats.completionRate.toFixed(1)}% completion rate
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 shadow-lg border border-violet-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium">Total Spent</p>
                <p className="text-xl font-bold text-violet-700">${stats.totalSpent.toFixed(0)}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-violet-200 to-purple-200 rounded-lg flex items-center justify-center shadow-sm">
                <DollarSign className="w-5 h-5 text-violet-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-600">
              ${stats.averageCost.toFixed(0)} avg per visit
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 shadow-lg border border-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-medium">Treatments</p>
                <p className="text-xl font-bold text-amber-700">{stats.uniqueTreatments}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-amber-200 to-orange-200 rounded-lg flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 text-amber-700" />
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-600">
              {mostCommonTreatment[0]} most common
            </div>
          </div>
        </div>

        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            {filteredAppointments.length} appointment{filteredAppointments.length !== 1 ? 's' : ''} found
          </h2>
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-sky-600 hover:text-sky-700 text-sm font-medium transition-colors duration-200"
            >
              Clear filters
            </button>
          )}
        </div>

        
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden backdrop-blur-sm">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="p-3 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full w-fit mx-auto mb-3">
                <Calendar className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-600 mb-1">No appointments found</h3>
              <p className="text-slate-500 text-sm">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters.' 
                  : 'You haven\'t had any appointments yet.'}
              </p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              <div className="divide-y divide-slate-100">
                {filteredAppointments.slice(0, 10).map((appointment) => (
                  <div key={appointment.id} className="p-4 hover:bg-gradient-to-r hover:from-sky-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group" onClick={() => openDetailModal(appointment)}>
                    <div className="flex items-center gap-3">
                      
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                        {getTreatmentIcon(appointment.title)}
                      </div>
                      
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-semibold text-slate-800 truncate group-hover:text-sky-700 transition-colors duration-200">
                            {appointment.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1 ${STATUS_COLORS[appointment.status]} transition-all duration-200`}>
                              {STATUS_ICONS[appointment.status]}
                              {appointment.status}
                            </span>
                            {appointment.status === 'Completed' && (
                              <span className="text-emerald-600 font-semibold text-sm bg-emerald-50 px-2 py-0.5 rounded-full">
                                ${parseFloat(appointment.cost || 0).toFixed(0)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(appointment.appointmentDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(appointment.appointmentDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {getTimeAgo(appointment.appointmentDate)}
                          </div>
                          {appointment.files && appointment.files.length > 0 && (
                            <div className="flex items-center gap-1 text-sky-600">
                              <span className="text-xs">📎</span>
                              <span>{appointment.files.length} file{appointment.files.length > 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                        
                        {appointment.description && (
                          <p className="text-xs text-slate-600 mt-1 truncate">
                            {appointment.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredAppointments.length > 10 && (
                <div className="p-4 text-center border-t border-slate-100 bg-gradient-to-r from-slate-50 to-sky-50">
                  <p className="text-sm text-slate-500">
                    Showing 10 of {filteredAppointments.length} appointments
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <AppointmentDetailModal
        open={showDetailModal}
        onClose={closeDetailModal}
        appointment={selectedAppointment}
      />

      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.7s cubic-bezier(.4,0,.2,1) both; }
      `}</style>
    </div>
  );
} 