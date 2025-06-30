import React from 'react';
import { useAppData } from '../context/AppDataContext';
import TopPatientsCard from './TopPatientsCard';
import RevenueChart from './RevenueChart';
import { UserRound, CalendarClock, Hourglass, CheckCircle2, DollarSign, Medal } from 'lucide-react';

function getRevenueData(incidents) {
  const now = new Date();
  // Last 7 days (daily)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const value = incidents
      .filter(
        inc =>
          inc.status === 'Completed' &&
          new Date(inc.appointmentDate).toDateString() === d.toDateString()
      )
      .reduce((sum, inc) => sum + (parseFloat(inc.cost) || 0), 0);
    return { label, value };
  });
  // Last 4 weeks (weekly)
  const last4Weeks = Array.from({ length: 4 }).map((_, i) => {
    const start = new Date(now);
    start.setDate(now.getDate() - (7 * (3 - i)));
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    const label = `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    const value = incidents
      .filter(inc => {
        if (inc.status !== 'Completed') return false;
        const d = new Date(inc.appointmentDate);
        return d >= start && d <= end;
      })
      .reduce((sum, inc) => sum + (parseFloat(inc.cost) || 0), 0);
    return { label, value };
  });
  return { last7Days, last4Weeks };
}

export default function Dashboard() {
  const { incidents, patients } = useAppData();

  // Next 10 appointments (sorted by date, future only)
  const now = new Date();
  const nextAppointments = [...incidents]
    .filter(i => new Date(i.appointmentDate) >= now)
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 10);

  // Top patients by number of visits, with last visit
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
  const topPatients = [...patientVisitCounts]
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 3);

  // Pending/Completed treatments
  const pendingCount = incidents.filter(i => i.status === 'Pending' || i.status === 'In Progress').length;
  const completedCount = incidents.filter(i => i.status === 'Completed').length;

  // Total revenue (sum of completed treatments' cost)
  const totalRevenue = incidents
    .filter(i => i.status === 'Completed')
    .reduce((sum, i) => sum + (parseFloat(i.cost) || 0), 0);

  const kpis = [
    { label: 'Patients', icon: <UserRound className="w-6 h-6 stroke-2 text-blue-500" />, value: patients.length, color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Appointments', icon: <CalendarClock className="w-6 h-6 stroke-2 text-blue-500" />, value: incidents.length, color: 'bg-blue-100 text-blue-700' },
    { label: 'Pending', icon: <Hourglass className="w-6 h-6 stroke-2 text-slate-700" />, value: pendingCount, color: 'bg-orange-100 text-orange-700' },
    { label: 'Completed', icon: <CheckCircle2 className="w-6 h-6 stroke-2 text-green-600" />, value: completedCount, color: 'bg-green-100 text-green-700' },
    { label: 'Revenue', icon: <DollarSign className="w-6 h-6 stroke-2 text-purple-600" />, value: `$${totalRevenue.toLocaleString()}`, color: 'bg-purple-100 text-purple-700' },
  ];

  // Revenue chart data
  const { last7Days, last4Weeks } = getRevenueData(incidents);
  const [revenueMode, setRevenueMode] = React.useState('week'); // 'week' or 'month'
  const chartData = revenueMode === 'week' ? last7Days : last4Weeks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Search and user bar (optional, for polish) */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full md:w-1/3 px-5 py-3 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex items-center gap-4">
          <span className="text-gray-500 font-semibold">Admin</span>
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-700">A</div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <div key={kpi.label} className={`rounded-2xl shadow-md p-6 flex flex-col items-center ${kpi.color} hover:scale-105 transition-transform duration-200`}>
            <div className="mb-2">{kpi.icon}</div>
            <div className="text-2xl font-bold mb-1">{kpi.value}</div>
            <div className="text-sm font-semibold text-gray-700 text-center">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue Chart and Top Patients Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-white rounded-2xl shadow-md p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
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
            </div>
          </div>
          <RevenueChart data={chartData} />
        </div>
        {/* Top Patients Card */}
        <TopPatientsCard patients={patientVisitCounts} medalIcon={<Medal className="w-6 h-6 stroke-2 text-yellow-500 mr-2" />} />
      </div>

      {/* Next: Add horizontal bar charts, circular progress, and recent appointments list */}
    </div>
  );
} 