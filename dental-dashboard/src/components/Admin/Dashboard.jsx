import React, { useState } from 'react';
import { useAppData } from '../../context/AppDataContext';
import { CombinedTopCard } from './TopPatientsCard';
import RevenueChart from './RevenueChart';
import { UserRound, CalendarClock, CheckCircle2, DollarSign, Medal, Wrench, Star } from 'lucide-react';


function getDisplayStatus(inc) {
  const now = new Date();
  const apptDate = new Date(inc.appointmentDate);
  if (apptDate < now && (inc.status === 'Pending' || inc.status === 'In Progress')) {
    return 'Completed';
  }
  return inc.status;
}

function getRevenueData(incidents) {
  const now = new Date();
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const value = incidents
      .filter(
        inc =>
          getDisplayStatus(inc) === 'Completed' &&
          new Date(inc.appointmentDate).toDateString() === d.toDateString()
      )
      .reduce((sum, inc) => sum + (parseFloat(inc.cost) || 0), 0);
    return { label, value };
  });
  const last4Weeks = Array.from({ length: 4 }).map((_, i) => {
    const start = new Date(now);
    start.setDate(now.getDate() - (7 * (3 - i)));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const label = `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    const value = incidents
      .filter(inc => {
        if (getDisplayStatus(inc) !== 'Completed') return false;
        const d = new Date(inc.appointmentDate);
        return d >= start && d <= end;
      })
      .reduce((sum, inc) => sum + (parseFloat(inc.cost) || 0), 0);
    return { label, value };
  });
  const year = now.getFullYear();
  const last12Months = Array.from({ length: 12 }).map((_, i) => {
    const d = new Date(year, i, 1);
    const label = d.toLocaleDateString(undefined, { month: 'short' });
    const value = incidents
      .filter(inc => {
        if (getDisplayStatus(inc) !== 'Completed') return false;
        const date = new Date(inc.appointmentDate);
        return date.getFullYear() === year && date.getMonth() === i;
      })
      .reduce((sum, inc) => sum + (parseFloat(inc.cost) || 0), 0);
    return { label, value };
  });
  return { last7Days, last4Weeks, last12Months };
}

export default function Dashboard() {
  const { incidents, patients } = useAppData();
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);
  const [showPatientsModal, setShowPatientsModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [completedMonth, setCompletedMonth] = useState(new Date().getMonth());
  const [upcomingMonth, setUpcomingMonth] = useState(new Date().getMonth());
  const [showTodayModal, setShowTodayModal] = useState(false);

  const now = new Date();
  const nextAppointments = [...incidents]
    .filter(i => new Date(i.appointmentDate) >= now)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 10);
  const upcomingCount = nextAppointments.length;

  const patientVisitCounts = patients.map(p => {
    const patientIncidents = incidents.filter(i => i.patientId === p.id);
    const lastVisit = patientIncidents.length > 0
      ? new Date(Math.max(...patientIncidents.map(i => new Date(i.appointmentDate))))
      : null;
    return {
      ...p,
      visits: patientIncidents.length,
      lastVisit,
    };
  });
  const topPatients = [...patientVisitCounts].sort((a, b) => b.visits - a.visits).slice(0, 3);

  const completedCount = incidents.filter(i => getDisplayStatus(i) === 'Completed').length;

  const totalRevenue = incidents
    .filter(i => getDisplayStatus(i) === 'Completed')
    .reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);

  const kpis = [
    { label: 'Patients', icon: <UserRound className="w-6 h-6 stroke-2 text-yellow-500" />, value: patients.length, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Upcoming Appointments', icon: <CalendarClock className="w-6 h-6 stroke-2 text-blue-500" />, value: upcomingCount, color: 'bg-blue-100 text-blue-700', isUpcoming: true },
    { label: 'Completed', icon: <CheckCircle2 className="w-6 h-6 stroke-2 text-green-600" />, value: completedCount, color: 'bg-green-100 text-green-700' },
    { label: 'Revenue', icon: <DollarSign className="w-6 h-6 stroke-2 text-purple-600" />, value: `$${totalRevenue.toLocaleString()}`, color: 'bg-purple-100 text-purple-700' },
  ];

  const { last7Days, last4Weeks, last12Months } = getRevenueData(incidents);
  const [revenueMode, setRevenueMode] = React.useState('week');
  const chartData = revenueMode === 'week' ? last7Days : revenueMode === 'month' ? last4Weeks : last12Months;

  const today = new Date();
  const todayAppointments = [...incidents]
    .filter(i => {
      const apptDate = new Date(i.appointmentDate);
      return (
        apptDate.getFullYear() === today.getFullYear() &&
        apptDate.getMonth() === today.getMonth() &&
        apptDate.getDate() === today.getDate()
      );
    })
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const nowYear = new Date().getFullYear();
  const completedAppointmentsByMonth = (monthIdx) =>
    [...incidents]
      .filter(i => {
        if (getDisplayStatus(i) !== 'Completed') return false;
        const d = new Date(i.appointmentDate);
        if (monthIdx === 'all') return true;
        return d.getFullYear() === nowYear && d.getMonth() === monthIdx;
      })
      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));
  const completedAppointments = completedAppointmentsByMonth(completedMonth);
  const monthOptions = Array.from({ length: 12 }).map((_, i) => ({
    value: i,
    label: new Date(nowYear, i, 1).toLocaleString(undefined, { month: 'long' })
  }));

  const revenueByMonth = Array.from({ length: 12 }).map((_, i) => {
    const monthIncidents = incidents.filter(inc => {
      if (getDisplayStatus(inc) !== 'Completed') return false;
      const date = new Date(inc.appointmentDate);
      return date.getFullYear() === nowYear && date.getMonth() === i;
    });
    const value = monthIncidents.reduce((sum, inc) => sum + (parseFloat(inc.cost) || 0), 0);
    return {
      month: new Date(nowYear, i, 1).toLocaleString(undefined, { month: 'long' }),
      value
    };
  });

  const upcomingAppointmentsByMonth = (monthIdx) =>
    [...incidents]
      .filter(i => {
        const apptDate = new Date(i.appointmentDate);
        if (apptDate < now) return false;
        if (monthIdx === 'all') return true;
        return apptDate.getFullYear() === nowYear && apptDate.getMonth() === monthIdx;
      })
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
  const filteredUpcomingAppointments = upcomingAppointmentsByMonth(upcomingMonth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {kpis.map((kpi, idx) => (
          <div key={kpi.label} className={`rounded-2xl shadow-md p-4 flex flex-col items-center ${kpi.color} hover:scale-105 transition-transform duration-200`}>
            <div className="mb-2">{kpi.icon}</div>
            <div className="text-2xl font-bold mb-1">{kpi.value}</div>
            <div className="text-sm font-semibold text-gray-700 text-center">{kpi.label}</div>
            {kpi.label === 'Patients' && (
              <button
                className="mt-2 px-3 py-1 rounded-lg bg-yellow-500 text-white text-xs font-semibold hover:bg-yellow-600 transition-colors"
                onClick={() => setShowPatientsModal(true)}
              >
                View
              </button>
            )}
            {kpi.isUpcoming && (
              <button
                className="mt-2 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                onClick={() => setShowUpcomingModal(true)}
              >
                View
              </button>
            )}
            {kpi.label === 'Completed' && (
              <button
                className="mt-2 px-3 py-1 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors"
                onClick={() => setShowCompletedModal(true)}
              >
                View
              </button>
            )}
            {kpi.label === 'Revenue' && (
              <button
                className="mt-2 px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition-colors"
                onClick={() => setShowRevenueModal(true)}
              >
                View
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-blue-700">Revenue Overview</h3>
              <div className="flex gap-2">
                <button
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${revenueMode === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                  onClick={() => setRevenueMode('week')}
                >
                  Last 7 Days
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${revenueMode === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                  onClick={() => setRevenueMode('month')}
                >
                  Last 4 Weeks
                </button>
                <button
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${revenueMode === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-100'}`}
                  onClick={() => setRevenueMode('monthly')}
                >
                  Monthly
                </button>
              </div>
            </div>
            <RevenueChart data={chartData} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="bg-blue-50 rounded-2xl shadow-lg p-4 flex flex-col max-w-full w-full border border-blue-100 h-full">
              <div className="flex items-center gap-2 mb-2">
                <CalendarClock className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-blue-700 tracking-wide">Today's Appointments</h3>
              </div>
              <div className="border-b border-blue-100 mb-2" />
              {todayAppointments.length === 0 ? (
                <div className="text-gray-400 text-center py-2 text-sm">No appointments scheduled for today.</div>
              ) : (
                <ul className="divide-y divide-blue-50">
                  {todayAppointments.map((app) => {
                    const patient = patients.find(p => p.id === app.patientId);
                    return (
                      <li key={app.id} className="py-1.5 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-base shadow-sm">
                          {patient?.name?.[0] || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 truncate text-sm">{app.title}</div>
                          <div className="text-xs text-gray-500 truncate">{patient?.name || 'Unknown Patient'}</div>
                        </div>
                        <div className="text-xs text-blue-700 font-semibold whitespace-nowrap bg-blue-50 rounded px-2 py-1 ml-2">
                          {new Date(app.appointmentDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
              <button
                className="mt-4 px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors self-center"
                onClick={() => setShowTodayModal(true)}
              >
                View
              </button>
            </div>
            <div className="bg-pink-50 rounded-2xl shadow-lg p-4 flex flex-col max-w-full w-full border border-pink-100 h-full">
              <h3 className="text-base font-bold text-pink-700 tracking-wide mb-2">Customer Satisfaction</h3>
              <div className="flex flex-col gap-1.5 flex-1 justify-center">
                <div>
                  <div className="font-semibold text-pink-800 mb-0">Service Rating</div>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'fill-pink-500 text-pink-500' : 'text-pink-300'}`} fill={i <= 4 ? '#ec4899' : 'none'} />
                    ))}
                    <span className="ml-2 font-bold text-pink-700">4.7/5</span>
                    <span className="ml-2 text-xs text-gray-500">(120 reviews)</span>
                  </div>
                </div>
                <div className="mt-1">
                  <div className="font-semibold text-pink-800 mb-0">Staff Rating</div>
                  <div className="flex items-center gap-2">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-5 h-5 fill-pink-500 text-pink-500" fill="#ec4899" />
                    ))}
                    <span className="ml-2 font-bold text-pink-700">4.9/5</span>
                    <span className="ml-2 text-xs text-gray-500">(110 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <CombinedTopCard
          patients={topPatients}
          incidents={incidents}
          medalIcon={<Medal className="w-6 h-6 stroke-2 text-yellow-500 mr-2" />} 
          serviceIcon={<Wrench className="w-6 h-6 stroke-2 text-pink-700 mr-2" />} 
        />
      </div>

      {showUpcomingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold"
              onClick={() => setShowUpcomingModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
                <CalendarClock className="w-6 h-6 text-blue-500 mr-2" /> Upcoming Appointments
              </h3>
              <select
                className="text-xs font-semibold px-3 py-1 rounded-lg border border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors outline-none"
                value={upcomingMonth}
                onChange={e => setUpcomingMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              >
                {monthOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                <option value="all">All</option>
              </select>
            </div>
            {filteredUpcomingAppointments.length === 0 ? (
              <div className="text-gray-400 text-center py-12">No upcoming appointments</div>
            ) : (
              <ul className="divide-y divide-blue-50">
                {filteredUpcomingAppointments.map((app) => {
                  const patient = patients.find(p => p.id === app.patientId);
                  return (
                    <li key={app.id} className="py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                        {patient?.name?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate text-base">{app.title}</div>
                        <div className="text-sm text-gray-500 truncate">{patient?.name || 'Unknown Patient'}</div>
                      </div>
                      <div className="text-sm text-blue-700 font-semibold whitespace-nowrap bg-blue-50 rounded px-3 py-1 ml-2">
                        {new Date(app.appointmentDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {showPatientsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-yellow-600 text-2xl font-bold"
              onClick={() => setShowPatientsModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-yellow-700 mb-6 flex items-center gap-2">
              <UserRound className="w-6 h-6 text-yellow-500 mr-2" /> Patients
            </h3>
            {patients.length === 0 ? (
              <div className="text-gray-400 text-center py-12">No patients found</div>
            ) : (
              <ul className="divide-y divide-yellow-50">
                {patients.map((p) => (
                  <li key={p.id} className="py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-700 font-bold text-lg">
                      {p.profilePic ? (
                        <img src={p.profilePic} alt={p.name} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        p.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-800 truncate text-base">{p.name}</div>
                      <div className="text-sm text-gray-500 truncate">{p.email || p.contact || ''}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {showCompletedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-2xl font-bold"
              onClick={() => setShowCompletedModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600 mr-2" /> Completed Appointments
              </h3>
              <select
                className="text-xs font-semibold px-3 py-1 rounded-lg border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 transition-colors outline-none"
                value={completedMonth}
                onChange={e => setCompletedMonth(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              >
                {monthOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                <option value="all">All</option>
              </select>
            </div>
            {completedAppointments.length === 0 ? (
              <div className="text-gray-400 text-center py-12">No completed appointments found</div>
            ) : (
              <ul className="divide-y divide-green-50">
                {completedAppointments.map((app) => {
                  const patient = patients.find(p => p.id === app.patientId);
                  return (
                    <li key={app.id} className="py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-lg">
                        {patient?.profilePic ? (
                          <img src={patient.profilePic} alt={patient.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          patient?.name ? patient.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() : 'A'
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate text-base">{app.title}</div>
                        <div className="text-sm text-gray-500 truncate">{patient?.name || 'Unknown Patient'}</div>
                      </div>
                      <div className="text-sm text-green-700 font-semibold whitespace-nowrap bg-green-50 rounded px-3 py-1 ml-2">
                        {new Date(app.appointmentDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {showRevenueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-purple-600 text-2xl font-bold"
              onClick={() => setShowRevenueModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-purple-700 mb-6 flex items-center gap-2">
              <DollarSign className="w-6 h-6 text-purple-600 mr-2" /> Revenue by Month ({nowYear})
            </h3>
            <ul className="divide-y divide-purple-50">
              {revenueByMonth.map((m) => (
                <li key={m.month} className="py-3 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate text-base">{m.month}</div>
                  </div>
                  <div className="text-base text-purple-700 font-semibold whitespace-nowrap bg-purple-50 rounded px-3 py-1 ml-2">
                    ${m.value.toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showTodayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold"
              onClick={() => setShowTodayModal(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
              <CalendarClock className="w-6 h-6 text-blue-500 mr-2" /> Today's Appointments
            </h3>
            {todayAppointments.length === 0 ? (
              <div className="text-gray-400 text-center py-12">No appointments scheduled for today.</div>
            ) : (
              <ul className="divide-y divide-blue-50">
                {todayAppointments.map((app) => {
                  const patient = patients.find(p => p.id === app.patientId);
                  return (
                    <li key={app.id} className="py-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
                        {patient?.name?.[0] || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-800 truncate text-base">{app.title}</div>
                        <div className="text-sm text-gray-500 truncate">{patient?.name || 'Unknown Patient'}</div>
                      </div>
                      <div className="text-sm text-blue-700 font-semibold whitespace-nowrap bg-blue-50 rounded px-3 py-1 ml-2">
                        {new Date(app.appointmentDate).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 