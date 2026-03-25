'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ZoneData {
  zone: string;
  minutes: number;
  percentage: number;
  color: string;
}

interface ZoneDistributionProps {
  data: ZoneData[];
  title: string;
  height?: number;
}

const ZONE_COLORS = {
  'Z1': '#10b981',
  'Z2': '#06b6d4',
  'Z3': '#3b82f6',
  'Z4': '#f59e0b',
  'Z5': '#ef4444',
  'Z6': '#dc2626',
  'Z7': '#7c3aed',
};

export function ZoneDistribution({ data, title, height = 300 }: ZoneDistributionProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="zone" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151' }}
            labelStyle={{ color: '#e5e7eb' }}
            formatter={(value) => `${value} min`}
          />
          <Bar dataKey="minutes" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={ZONE_COLORS[entry.zone as keyof typeof ZONE_COLORS] || '#6b7280'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {data.map((zone) => (
          <div key={zone.zone} className="text-center">
            <div className="text-sm font-semibold text-gray-100">{zone.zone}</div>
            <div className="text-xs text-gray-400">{zone.percentage}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
