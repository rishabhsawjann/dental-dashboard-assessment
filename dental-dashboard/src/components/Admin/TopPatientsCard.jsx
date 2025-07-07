import React from 'react';

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

export default function TopPatientsCard({ patients, medalIcon }) {
  
  const sorted = [...patients].sort((a, b) => b.visits - a.visits);
  const top3 = sorted.slice(0, 3);
  const extraCount = sorted.length > 3 ? sorted.length - 3 : 0;

  return (
    <div className="rounded-2xl shadow-md p-6 bg-pink-50 flex flex-col items-center w-full max-w-md mx-auto">
      <h3 className="text-2xl font-extrabold text-pink-800 mb-4 w-full text-center flex items-center justify-center gap-2 border-b-2 border-pink-200 pb-2 tracking-wide">
        {medalIcon}
        Top Patients
      </h3>
      <div className="flex flex-col gap-3 w-full justify-center">
        {top3.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 shadow-sm hover:bg-pink-100 transition-all min-w-[180px]"
          >
            
            <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-lg font-bold text-pink-700 shadow-sm">
              {p.profilePic ? (
                <img src={p.profilePic} alt={p.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                getInitials(p.name)
              )}
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-gray-800 truncate">{p.name}</span>
              <span className="text-xs text-gray-500">{p.visits} visits</span>
            </div>
          </div>
        ))}
        {extraCount > 0 && (
          <span className="ml-2 px-3 py-1 bg-pink-200 text-pink-800 rounded-full text-xs font-semibold whitespace-nowrap self-center">+{extraCount} more</span>
        )}
      </div>
    </div>
  );
}

export function TopServicesCard({ incidents, serviceIcon }) {
  
  const serviceCounts = incidents.reduce((acc, inc) => {
    acc[inc.title] = (acc[inc.title] || 0) + 1;
    return acc;
  }, {});
  
  const sorted = Object.entries(serviceCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count);
  const top3 = sorted.slice(0, 3);

  return (
    <div className="rounded-2xl shadow-md p-6 bg-pink-50 flex flex-col items-center w-full max-w-md mx-auto mt-6">
      <h3 className="text-2xl font-extrabold text-pink-800 mb-4 w-full text-center flex items-center justify-center gap-2 border-b-2 border-pink-200 pb-2 tracking-wide">
        {serviceIcon}
        Top Services
      </h3>
      <div className="flex flex-col gap-3 w-full justify-center">
        {top3.map((s) => (
          <div
            key={s.title}
            className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 shadow-sm hover:bg-pink-100 transition-all min-w-[180px]"
          >
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-gray-800 truncate">{s.title}</span>
            </div>
            <span className="text-xs text-gray-500 font-semibold">{s.count} times</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CombinedTopCard({ patients, incidents, medalIcon, serviceIcon }) {
 
  const sortedPatients = [...patients].sort((a, b) => b.visits - a.visits);
  const top3Patients = sortedPatients.slice(0, 3);
  
  const serviceCounts = incidents.reduce((acc, inc) => {
    acc[inc.title] = (acc[inc.title] || 0) + 1;
    return acc;
  }, {});
  const sortedServices = Object.entries(serviceCounts)
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count);
  const top3Services = sortedServices.slice(0, 3);

  return (
    <div className="rounded-2xl shadow-md p-4 bg-pink-50 flex flex-col items-center w-full max-w-md mx-auto">
     
      <h3 className="text-xl font-extrabold text-pink-800 mb-3 w-full text-center flex items-center justify-center gap-2 border-b-2 border-pink-200 pb-2 tracking-wide">
        {medalIcon}
        Top Patients
      </h3>
      <div className="flex flex-col gap-2 w-full justify-center mb-4">
        {top3Patients.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 shadow-sm hover:bg-pink-100 transition-all min-w-[180px]"
          >
            
            <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-lg font-bold text-pink-700 shadow-sm">
              {p.profilePic ? (
                <img src={p.profilePic} alt={p.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                getInitials(p.name)
              )}
            </div>
            
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-gray-800 truncate">{p.name}</span>
              <span className="text-xs text-gray-500">{p.visits} visits</span>
            </div>
          </div>
        ))}
      </div>
     
      <h3 className="text-xl font-extrabold text-pink-800 mb-3 w-full text-center flex items-center justify-center gap-2 border-b-2 border-pink-200 pb-2 tracking-wide">
        {serviceIcon}
        Top Services
      </h3>
      <div className="flex flex-col gap-2 w-full justify-center">
        {top3Services.map((s) => (
          <div
            key={s.title}
            className="flex items-center gap-2 bg-white rounded-xl px-3 py-1.5 shadow-sm hover:bg-pink-100 transition-all min-w-[180px]"
          >
            <div className="flex flex-col min-w-0 flex-1">
              <span className="font-semibold text-gray-800 truncate">{s.title}</span>
            </div>
            <span className="text-xs text-gray-500 font-semibold">{s.count} times</span>
          </div>
        ))}
      </div>
    </div>
  );
} 