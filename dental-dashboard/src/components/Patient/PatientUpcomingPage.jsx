import React, { useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { Calendar, TrendingUp, Activity, DollarSign, User2, Clock, CheckCircle2, XCircle, ChevronRight, Sparkles, Smile, Brush, Wrench, Camera, Droplets, Pill, Stethoscope, Crown, Bone, Pencil } from 'lucide-react';
import SERVICES from '../../constants/services';

const STATUS_STYLES = {
  Pending: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-200 shadow-sm',
  Completed: 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 shadow-sm',
  Cancelled: 'bg-gradient-to-r from-rose-50 to-red-50 text-rose-700 border-rose-200 shadow-sm',
  'In Progress': 'bg-gradient-to-r from-sky-50 to-blue-50 text-sky-700 border-sky-200 shadow-sm',
};

function getCountdown(date) {
  const now = new Date();
  const d = new Date(date);
  const diff = d - now;
  if (diff <= 0) return 'Now';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function SummaryCard({ icon, label, value, bg, iconBg, textColor }) {
  return (
    <div className={`rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center border border-gray-100 min-h-[110px] group ${bg} backdrop-blur-sm hover:scale-105`}> 
      <div className={`mb-2 rounded-full p-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${iconBg} shadow-md`}>{icon}</div>
      <div className={`text-xs font-medium mb-1 text-center ${textColor}`}>{label}</div>
      <div className={`text-2xl font-bold text-center ${textColor} drop-shadow-sm`}>{value}</div>
    </div>
  );
}

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
  Bone,
  Pencil,
};

export default function PatientUpcomingPage() {
  const { user } = useAuth();
  const { patients, incidents } = useAppData();
  const currentPatient = patients.find(p => p.id === user?.patientId);
  
  
  const patientAppointments = useMemo(() => 
    incidents.filter(i => i.patientId === currentPatient?.id),
    [incidents, currentPatient]
  );

  const allUpcoming = useMemo(() => {
    const now = new Date();
    return patientAppointments
      .filter(i => new Date(i.appointmentDate) >= now && i.status !== 'Completed')
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  }, [patientAppointments]);


  const completed = useMemo(() => 
    patientAppointments.filter(i => i.status === 'Completed'), 
    [patientAppointments]
  );

  
  const totalSpent = useMemo(() => 
    completed.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0),
    [completed]
  );

  
  const uniqueTreatments = useMemo(() => 
    new Set(patientAppointments.map(i => i.title)).size,
    [patientAppointments]
  );

  
  const upcomingCost = useMemo(() => 
    allUpcoming.reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0),
    [allUpcoming]
  );
 
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  function openModal(appt) {
    setSelectedAppt(appt);
    setModalOpen(true);
  }
  
  function closeModal() {
    setModalOpen(false);
    setSelectedAppt(null);
  }

  
  if (!user || !currentPatient) {
      return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gradient-to-r from-blue-400 to-purple-400 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your appointments...</p>
      </div>
    </div>
  );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 flex flex-col items-center py-0 md:py-10 px-0 md:px-8 font-sans">
      
      <div className="w-full max-w-4xl mx-auto px-4 md:px-0 mt-2 mb-4 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center gap-2 mb-2 w-full text-center">
          <div className="w-10 h-10 text-white bg-gradient-to-r from-blue-400 to-purple-500 rounded-full shadow-lg p-2 flex items-center justify-center mx-auto mb-1">
            <User2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent tracking-tight leading-snug w-full" style={{lineHeight: '1.2'}}>
            Upcoming Appointments
          </h1>
        </div>
        <p className="text-gray-600 text-base md:text-lg text-center max-w-2xl w-full">
          Welcome back, <span className="font-semibold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">{currentPatient.name}</span>! 
          Here are your next appointments and treatment summary.
        </p>
      </div>

      
      <div className="w-full max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 px-4 md:px-0">
        <SummaryCard 
          icon={<Calendar className="w-6 h-6 text-white" />} 
          label="Next Appointment" 
          value={allUpcoming[0] ? getCountdown(allUpcoming[0].appointmentDate) : 'No upcoming'}
          bg="bg-gradient-to-br from-blue-400 to-blue-500" iconBg="bg-white/20" textColor="text-white"
        />
        <SummaryCard 
          icon={<TrendingUp className="w-6 h-6 text-white" />} 
          label="Total Spent" 
          value={`$${totalSpent.toFixed(2)}`}
          bg="bg-gradient-to-br from-emerald-400 to-green-500" iconBg="bg-white/20" textColor="text-white"
        />
        <SummaryCard 
          icon={<Activity className="w-6 h-6 text-white" />} 
          label="Treatments" 
          value={uniqueTreatments}
          bg="bg-gradient-to-br from-purple-400 to-indigo-500" iconBg="bg-white/20" textColor="text-white"
        />
        <SummaryCard 
          icon={<DollarSign className="w-6 h-6 text-white" />} 
          label="Upcoming Cost" 
          value={`$${upcomingCost.toFixed(2)}`}
          bg="bg-gradient-to-br from-amber-400 to-orange-500" iconBg="bg-white/20" textColor="text-white"
        />
      </div>

      
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col items-center mt-2 relative">
        <div className="w-full flex flex-col items-center justify-center px-2 md:px-0 py-4">
          {allUpcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <Calendar className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-gray-500 text-xl font-semibold mb-2">No upcoming appointments</div>
              <div className="text-gray-400 text-base">You have no scheduled appointments. Book your next visit to keep your smile healthy!</div>
            </div>
          ) : (
            <div className="relative w-full">
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-300 via-purple-300 to-pink-300 rounded-full z-0 shadow-lg" style={{marginLeft: '-2px'}} />
              <ul className="space-y-8">
                {allUpcoming.map((appt, idx) => {
                  const service = SERVICES.find(s => s.label === appt.title);
                  const price = parseFloat(appt.cost) || 0;
                  const statusIcon =
                    appt.status === 'Completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> :
                    appt.status === 'Cancelled' ? <XCircle className="w-5 h-5 text-rose-500" /> :
                    <Clock className="w-5 h-5 text-sky-500" />;
                  
                  return (
                    <li key={appt.id} className="relative flex items-start group animate-fadeInUp" style={{animationDelay: `${idx * 80}ms`, animationFillMode: 'backwards'}}>
                      <div className="z-10 flex flex-col items-center mr-4">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg bg-white ${appt.status === 'Completed' ? 'ring-2 ring-emerald-300 shadow-emerald-200' : appt.status === 'Cancelled' ? 'ring-2 ring-rose-200 shadow-rose-100' : 'ring-2 ring-sky-200 shadow-sky-100'}`}>{statusIcon}</div>
                        {idx !== allUpcoming.length - 1 && <div className="flex-1 w-1 bg-gradient-to-b from-blue-100 to-purple-100 shadow-sm" style={{minHeight: '32px'}} />}
                      </div>
                     
                      <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 px-6 py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-6 hover:shadow-xl hover:bg-white/90 transition-all duration-300 group-hover:scale-[1.02]">
                        <div className="flex items-center gap-3 min-w-[60px]">
                          <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm">
                            <span className="text-2xl md:text-3xl">{service && lucideIconMap[service.icon] ? React.createElement(lucideIconMap[service.icon], { className: 'w-7 h-7 text-blue-500' }) : <Smile className="w-7 h-7 text-blue-500" />}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 text-base md:text-lg">{appt.title}</div>
                            <div className="text-xs text-gray-500">{new Date(appt.appointmentDate).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[appt.status] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 shadow-sm'}`}>{appt.status}</span>
                          <span className="text-blue-500 font-medium text-xs md:text-sm bg-blue-50 px-2 py-0.5 rounded-full">{getCountdown(appt.appointmentDate)} left</span>
                          {appt.description && <span className="text-gray-500 text-xs truncate max-w-xs">{appt.description}</span>}
                          {appt.files && appt.files.length > 0 && (
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                              📎 {appt.files.length}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end min-w-[90px]">
                          <span className="text-emerald-600 font-bold text-lg drop-shadow-sm">{`$${price.toFixed(2)}`}</span>
                          <button 
                            className="mt-2 text-xs text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 group/action focus:outline-none focus:ring-2 focus:ring-blue-200 rounded transition-colors duration-200"
                            onClick={() => openModal({ ...appt, service, price })}
                            type="button"
                          >
                            View Details <ChevronRight className="w-4 h-4 group-hover/action:translate-x-1 transition-transform duration-200" />
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {modalOpen && selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeInUp border border-white/50">
            <button onClick={closeModal} className="absolute top-3 right-3 text-gray-400 hover:text-rose-500 text-xl font-bold focus:outline-none transition-colors duration-200" aria-label="Close">&times;</button>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm">
                <span className="text-3xl">{selectedAppt.service && lucideIconMap[selectedAppt.service.icon] ? React.createElement(lucideIconMap[selectedAppt.service.icon], { className: 'w-7 h-7 text-blue-500' }) : <Smile className="w-7 h-7 text-blue-500" />}</span>
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900">{selectedAppt.title}</div>
                <div className="text-xs text-gray-500">{new Date(selectedAppt.appointmentDate).toLocaleString()}</div>
              </div>
            </div>
            <div className="mb-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[selectedAppt.status] || 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 border-gray-300 shadow-sm'}`}>{selectedAppt.status}</span>
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <strong>Description:</strong> {selectedAppt.description || 'No description provided.'}
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <strong>Cost:</strong> <span className="text-emerald-600 font-semibold">${selectedAppt.price.toFixed(2)}</span>
            </div>
            <div className="mb-2 text-gray-700 text-sm">
              <strong>Countdown:</strong> <span className="text-blue-500 font-medium">{getCountdown(selectedAppt.appointmentDate)}</span>
            </div>
            {selectedAppt.files && selectedAppt.files.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <span className="text-sm">📎</span>
                  <span>Attached Files ({selectedAppt.files.length})</span>
                </h4>
                <div className="space-y-2">
                  {selectedAppt.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)}KB)</span>
                      </div>
                      <button
                        onClick={() => window.open(file.url, '_blank')}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
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
      )}
     
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