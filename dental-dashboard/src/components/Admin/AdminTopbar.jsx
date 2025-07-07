import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, CalendarClock, CalendarDays, Settings } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Stethoscope },
  { to: '/appointments', label: 'Appointments', icon: CalendarClock },
  { to: '/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function AdminTopbar() {
  return (
    <header className="h-16 w-full bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-gray-200 shadow-xl flex items-center px-6 relative">
      <div className="absolute left-0 top-0 h-full flex items-center pl-6">
        
      </div>
      <nav className="flex items-center gap-4 mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-200 relative group
                ${isActive
                  ? 'bg-blue-100 text-blue-700 border-b-4 border-blue-500 shadow-md font-bold'
                  : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg hover:border-b-4 hover:border-blue-300'}
                `
              }
              style={{ borderBottomWidth: '4px' }}
            >
              <Icon className="w-6 h-6" />
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
} 