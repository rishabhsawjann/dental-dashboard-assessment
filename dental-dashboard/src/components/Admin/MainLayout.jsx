import React from 'react';
import Sidebar from './Sidebar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 overflow-y-auto">{children}</main>
    </div>
  );
} 