import React from 'react';
import AdminTopbar from './AdminTopbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminTopbar />
      <main className="flex-1 px-4 md:px-8 py-6">{children}</main>
    </div>
  );
} 