'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { PMCData } from '@/types';

interface PMCChartProps {
  data: PMCData[];
  height?: number;
}

export function PMCChart({ data, height = 400 }: PMCChartProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Performance Management Chart (PMC)</h2>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-400">Fitness (CTL)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-400">Fatigue (ATL)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-400">Form (TSB)</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCtl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorAtl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #374151' }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Area
            type="monotone"
            dataKey="ctl"
            stroke="#3b82f6"
            fillOpacity={1}
            fill="url(#colorCtl)"
            name="Fitness (CTL)"
          />
          <Area
            type="monotone"
            dataKey="atl"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorAtl)"
            name="Fatigue (ATL)"
          />
          <Line
            type="monotone"
            dataKey="tsb"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Form (TSB)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
