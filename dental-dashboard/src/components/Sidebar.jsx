import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Stethoscope, CalendarClock, CalendarDays } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Stethoscope },
  { to: '/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex flex-col h-full w-72 bg-gradient-to-b from-blue-50 via-white to-indigo-50 border-r border-gray-200 shadow-xl rounded-3xl m-4 overflow-hidden">
      {/* Logo Section */}
      <div className="flex items-center justify-center h-20 border-b border-gray-100 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-t-3xl">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-blue-600 tracking-wide">DentalCare</h1>
          <p className="text-xs text-gray-500 mt-1">Professional Dental Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-6 py-8 space-y-3">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <React.Fragment key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-semibold transition-all duration-200 relative group
                  ${isActive
                    ? 'bg-blue-100 text-blue-700 shadow-md border-l-4 border-blue-500 font-bold'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg hover:border-l-4 hover:border-blue-300'}
                  `
                }
              >
                <Icon className="w-6 h-6 text-blue-500 group-hover:text-blue-700 transition-colors duration-200" />
                <span className="truncate">{item.label}</span>
                {/* Left border indicator for active */}
                <span
                  className={`absolute left-0 top-2 bottom-2 w-1.5 rounded-full transition-all duration-200
                    ${window.location.pathname === item.to ? 'bg-blue-500 shadow-lg' : 'group-hover:bg-blue-300 group-hover:shadow-md'}`}
                />
              </NavLink>
              {/* Add extra spacing after Appointments for clarity */}
              {item.label === 'Appointments' && <div className="my-2" />}
            </React.Fragment>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="flex items-center gap-3 px-6 py-6 border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-b-3xl shadow-inner">
        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-700">
          {user?.name ? user.name[0].toUpperCase() : 'A'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-800 truncate">{user?.email || 'admin@entnt.in'}</div>
          <div className="text-xs text-gray-500">{user?.role || 'Admin'}</div>
        </div>
        <button
          onClick={logout}
          className="text-blue-500 hover:text-blue-700 font-semibold text-sm px-3 py-1 rounded-lg transition-colors duration-200 border border-blue-100 hover:bg-blue-50"
        >
          Logout
        </button>
      </div>
    </aside>
  );
} 