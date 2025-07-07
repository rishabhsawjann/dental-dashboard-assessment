import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { DollarSign } from 'lucide-react';

export default function RevenueChart({ data }) {
  return (
    <div className="w-full h-48 relative">
      
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center" style={{ height: '90%' }}>
        <DollarSign className="w-8 h-8 text-green-500 opacity-80" />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 32, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="label" tick={{ fontSize: 14, fill: '#64748b' }} />
          <YAxis tick={{ fontSize: 14, fill: '#64748b' }} />
          <Tooltip formatter={v => `$${v.toLocaleString()}`} cursor={{ fill: '#f1f5f9' }} />
          <Bar dataKey="value" fill="#a5b4fc" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 