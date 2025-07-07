import React from 'react';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';

export default function PatientLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Topbar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
} 