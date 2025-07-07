import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import SERVICES from '../../constants/services';
import { Sparkles, Smile, Brush, Wrench, Camera, Droplets, Pill, Stethoscope, Crown, Bone, Pencil } from 'lucide-react';

function getAge(dob) {
  if (!dob) return '-';
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const lucideIconMap = {
  Sparkles,
  Smile,
  Brush,
  Wrench,
  Camera,
  Droplets,
  Pill,
  Stethoscope,
  Crown,
  Bone,
  Pencil,
};

export default function PatientDetailsPage() {
  const { user } = useAuth();
  const { patients, incidents } = useAppData();

  const currentPatient = patients.find(p => p.id === user?.patientId);

  if (!user || user.role !== 'Patient') {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 border border-red-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Access Denied</h2>
        <p className="text-gray-600">You need to be logged in as a patient to view this page.</p>
      </div>
    );
  }

  if (!currentPatient) {
    return (
      <div className="max-w-xl mx-auto mt-12 bg-white rounded-2xl shadow-xl p-8 border border-yellow-100">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Patient Not Found</h2>
        <p className="text-gray-600">Patient information could not be found.</p>
      </div>
    );
  }

  const now = new Date();
  const patientIncidents = incidents
    ? [...incidents.filter(i => i.patientId === currentPatient.id && new Date(i.appointmentDate) < now)]
        .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
    : [];

  const recentIncidents = patientIncidents.slice(0, 3);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center py-0 md:py-8 px-0 md:px-8 relative overflow-hidden">

      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-indigo-200 to-blue-200 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full opacity-15 blur-lg"></div>
      
      <div className="w-full max-w-5xl mx-auto mb-4 md:mb-6 px-4 md:px-0 relative z-10">
        <div className="text-2xl md:text-3xl font-extrabold text-gray-800 flex items-center gap-3">
          <span role="img" aria-label="wave" className="animate-bounce">👋</span>
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg">
            Welcome back, {currentPatient.name}!
          </span>
        </div>
      </div>

      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 px-4 md:px-0 relative z-10">
        <div className="col-span-1 flex flex-col items-center bg-white rounded-3xl shadow-2xl p-6 md:p-7 border border-blue-100 hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] backdrop-blur-sm">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center overflow-hidden border-4 border-blue-200 shadow-xl mb-3 hover:shadow-2xl transition-all duration-300">
            {currentPatient.profilePic ? (
              <img src={currentPatient.profilePic} alt={currentPatient.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-5xl text-blue-300">👤</span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-1 text-center flex items-center gap-2">
            {currentPatient.name}
            {currentPatient.tags && currentPatient.tags.length > 0 && (
              <span className="flex gap-1">
                {currentPatient.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium ml-1 border border-blue-200 shadow-sm">{tag}</span>
                ))}
              </span>
            )}
          </h2>
          <div className="text-gray-500 text-sm mb-1 text-center">{user.email}</div>
          <div className="flex flex-col gap-0.5 text-gray-700 text-sm w-full mt-1">
            <div><b>Contact:</b> {currentPatient.contact}</div>
            <div><b>DOB:</b> {currentPatient.dob} ({getAge(currentPatient.dob)} yrs)</div>
            <div><b>Gender:</b> {currentPatient.gender}</div>
            <div><b>Blood Group:</b> {currentPatient.bloodGroup}</div>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-5 border border-blue-100 flex flex-col md:flex-row gap-5 hover:shadow-2xl transition-all duration-300 backdrop-blur-sm">
            <div className="flex-1">
              <div className="font-semibold text-blue-700 mb-0.5 text-base flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Health Info
              </div>
              <div className="text-gray-700 text-sm">{currentPatient.healthInfo || 'No health info provided.'}</div>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-blue-700 mb-0.5 text-base flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                Notes
              </div>
              <div className="text-gray-700 text-sm">{currentPatient.notes || 'No notes.'}</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-5 border border-blue-100 hover:shadow-3xl transition-all duration-300 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 animate-pulse">🕑</span> Recent Visits
            </h3>
            {recentIncidents.length === 0 ? (
              <div className="text-gray-400 text-center py-6 text-base">No recent visits found.</div>
            ) : (
              <div className="relative pl-4 md:pl-8">
                <div className="absolute left-1 md:left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-200 to-indigo-200 rounded-full opacity-80" style={{zIndex:0}}></div>
                <div className="space-y-4">
                  {recentIncidents.map((incident, index) => {
                    const service = SERVICES.find(s => s.label === incident.title);
                    let price = incident.cost;
                    if (service && (parseFloat(incident.cost) !== service.price)) {
                      price = service.price; 
                    }

                    return (
                      <div key={incident.id} className="relative flex items-start gap-4 z-10 hover:scale-[1.02] transition-all duration-300">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-lg font-bold absolute -left-7 md:-left-8 top-0 shadow-lg border-2 border-blue-200 hover:shadow-xl transition-all duration-300">
                          {service && lucideIconMap[service.icon] ? React.createElement(lucideIconMap[service.icon], { className: 'w-5 h-5 text-blue-500' }) : <Smile className="w-5 h-5 text-blue-500" />}
                        </div>
                        <div className="flex-1 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-3 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-1">
                            <div className="font-semibold text-blue-800 text-base flex items-center gap-2">
                              {incident.title}
                            </div>
                            <span className={`px-3 py-0.5 rounded-full text-xs font-semibold border shadow-sm ${
                              incident.status === 'Completed'
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : incident.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            }`}>{incident.status}</span>
                          </div>
                          <div className="text-gray-600 text-xs mb-0.5">{new Date(incident.appointmentDate).toLocaleString()}</div>
                          {incident.description && (
                            <div className="text-gray-700 mb-1 text-sm">{incident.description}</div>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-green-700 font-semibold text-base bg-green-100 px-2 py-1 rounded-lg border border-green-200">
                              ${parseFloat(price) % 1 === 0 ? parseInt(price) : parseFloat(price).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
