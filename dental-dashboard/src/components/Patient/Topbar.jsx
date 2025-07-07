import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { User, CalendarClock, History, Settings } from 'lucide-react';

export default function Topbar() {
  const { id } = useParams();

  const navItems = [
    { to: `/patients/${id}/details`, icon: User },
    { to: `/patients/${id}/upcoming`, icon: CalendarClock },
    { to: `/patients/${id}/history`, icon: History },
    { to: `/patients/${id}/settings`, icon: Settings },
  ];

  return (
    <header className="w-full h-16 bg-gradient-to-r from-blue-50 via-white to-indigo-50 border-b border-gray-200 shadow flex items-center px-8">
      <nav className="flex flex-row items-center gap-8 w-full justify-center">
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
