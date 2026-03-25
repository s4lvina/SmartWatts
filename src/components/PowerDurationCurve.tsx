'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PowerCurveData } from '@/types';

interface PowerDurationCurveProps {
  data: PowerCurveData[];
  height?: number;
  ftp?: number;
}

export function PowerDurationCurve({ data, height = 400, ftp }: PowerDurationCurveProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Power Duration Curve</h2>
        {ftp && <span className="text-sm text-gray-400">FTP: {ftp}W</span>}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="duration" 
            stroke="#9ca3af"
            scale="log"
          />
          <YAxis 
            stroke="#9ca3af"
            label={{ value: 'Power (watts)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151' }}
            labelStyle={{ color: '#e5e7eb' }}
            formatter={(value) => `${value}W`}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="watts"
            stroke="#fc4c02"
            strokeWidth={2}
            dot={{ fill: '#fc4c02', r: 4 }}
            activeDot={{ r: 6 }}
            name="Peak Power"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
