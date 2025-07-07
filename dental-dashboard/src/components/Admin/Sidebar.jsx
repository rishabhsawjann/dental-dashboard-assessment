import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, CalendarClock, CalendarDays, Settings } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Stethoscope },
  { to: '/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
];

export default function Sidebar() {
  return (
    <aside className="w-20 h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50 border-r border-gray-200 shadow-xl overflow-hidden flex flex-col justify-between items-center">
      
      <div className="flex-1 flex flex-col justify-center items-center gap-8 w-full">
        <nav className="flex flex-col items-center gap-6 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 relative group
                  ${isActive
                    ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-md font-bold'
                    : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg hover:border-l-4 hover:border-blue-300'}
                  `
                }
                style={{ borderLeftWidth: '4px' }}
              >
                <Icon className="w-6 h-6" />
              </NavLink>
            );
          })}
        </nav>
      </div>
     
      <div className="mb-6">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 relative group
            ${isActive
              ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500 shadow-md font-bold'
              : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg hover:border-l-4 hover:border-blue-300'}
            `
          }
          style={{ borderLeftWidth: '4px' }}
        >
          <Settings className="w-6 h-6" />
        </NavLink>
      </div>
    </aside>
  );
} 