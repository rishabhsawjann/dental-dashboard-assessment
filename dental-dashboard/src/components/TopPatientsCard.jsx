import React from 'react';

function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0]?.toUpperCase() || '')
    .join('')
    .slice(0, 2);
}

export default function TopPatientsCard({ patients, medalIcon }) {
  // Sort by visit count (descending)
  const sorted = [...patients].sort((a, b) => b.visits - a.visits);
  const top3 = sorted.slice(0, 3);
  const extraCount = sorted.length > 3 ? sorted.length - 3 : 0;

  return (
    <div className="rounded-2xl shadow-md p-6 bg-pink-50 flex flex-col items-center w-full max-w-md mx-auto">
      <h3 className="text-lg font-bold text-pink-700 mb-2 w-full text-center flex items-center justify-center gap-2">
        {medalIcon}
        Top Patients
      </h3>
      <div className="text-3xl font-extrabold text-pink-700 mb-4">{sorted.length}</div>
      <div className="flex flex-col gap-3 w-full justify-center">
        {top3.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm hover:bg-pink-100 transition-all min-w-[180px]"
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-lg font-bold text-pink-700 shadow-sm">
              {p.profilePic ? (
                <img src={p.profilePic} alt={p.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                getInitials(p.name)
              )}
            </div>
            {/* Info */}
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