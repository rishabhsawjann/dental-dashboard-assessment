import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function RevenueChart({ data }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
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