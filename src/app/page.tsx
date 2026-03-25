'use client';

import { useState } from 'react';
import { MetricCard } from '@/components/MetricCard';
import { PMCChart } from '@/components/PMCChart';
import { PowerDurationCurve } from '@/components/PowerDurationCurve';
import { ZoneDistribution } from '@/components/ZoneDistribution';

// Mock data for demonstration
const mockPMCData = [
  { date: '2024-01-01', ctl: 45, atl: 30, tsb: 15 },
  { date: '2024-01-05', ctl: 48, atl: 35, tsb: 13 },
  { date: '2024-01-10', ctl: 52, atl: 40, tsb: 12 },
  { date: '2024-01-15', ctl: 55, atl: 38, tsb: 17 },
  { date: '2024-01-20', ctl: 58, atl: 35, tsb: 23 },
  { date: '2024-01-25', ctl: 60, atl: 32, tsb: 28 },
  { date: '2024-02-01', ctl: 62, atl: 28, tsb: 34 },
];

const mockPowerCurveData = [
  { duration: '5s', watts: 1850 },
  { duration: '30s', watts: 1500 },
  { duration: '1min', watts: 1200 },
  { duration: '5min', watts: 450 },
  { duration: 'FTP', watts: 380 },
  { duration: '20min', watts: 370 },
  { duration: '60min', watts: 310 },
];

const mockPowerZoneData = [
  { zone: 'Z1', minutes: 120, percentage: 25, color: '#10b981' },
  { zone: 'Z2', minutes: 180, percentage: 37, color: '#06b6d4' },
  { zone: 'Z3', minutes: 100, percentage: 20, color: '#3b82f6' },
  { zone: 'Z4', minutes: 50, percentage: 10, color: '#f59e0b' },
  { zone: 'Z5', minutes: 30, percentage: 6, color: '#ef4444' },
  { zone: 'Z6', minutes: 10, percentage: 2, color: '#dc2626' },
  { zone: 'Z7', minutes: 0, percentage: 0, color: '#7c3aed' },
];

const mockHRZoneData = [
  { zone: 'Z1', minutes: 100, percentage: 20, color: '#10b981' },
  { zone: 'Z2', minutes: 200, percentage: 40, color: '#06b6d4' },
  { zone: 'Z3', minutes: 120, percentage: 24, color: '#3b82f6' },
  { zone: 'Z4', minutes: 60, percentage: 12, color: '#f59e0b' },
  { zone: 'Z5', minutes: 20, percentage: 4, color: '#ef4444' },
];

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <main className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-dark-secondary sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">SmartWatts</h1>
              <p className="text-gray-400 mt-1">Performance Cycling Analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-dark-card border border-gray-700 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-strava"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* KPI Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Current Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Fitness (CTL)"
              value={62}
              unit="points"
              trend="up"
              trendPercent={5.2}
              color="success"
            />
            <MetricCard
              label="Fatigue (ATL)"
              value={28}
              unit="points"
              trend="down"
              trendPercent={8.1}
              color="default"
            />
            <MetricCard
              label="Form (TSB)"
              value={34}
              unit="points"
              trend="up"
              trendPercent={12.5}
              color="strava"
            />
            <MetricCard
              label="FTP"
              value={380}
              unit="watts"
              trend="neutral"
              color="default"
            />
          </div>
        </section>

        {/* PMC Chart */}
        <section className="mb-12">
          <PMCChart data={mockPMCData} height={400} />
        </section>

        {/* Power Curve & Zones */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <PowerDurationCurve data={mockPowerCurveData} height={350} ftp={380} />
          <div>
            <ZoneDistribution
              data={mockPowerZoneData}
              title="Power Zones Distribution"
              height={300}
            />
          </div>
        </section>

        {/* Heart Rate Zones */}
        <section className="mb-12">
          <ZoneDistribution
            data={mockHRZoneData}
            title="Heart Rate Zones Distribution"
            height={300}
          />
        </section>

        {/* Coach Section (Placeholder) */}
        <section className="card">
          <div className="card-header">
            <h2 className="card-title">📊 AI Coach Analysis</h2>
          </div>
          <div className="space-y-4">
            <div className="bg-dark border border-gray-700 rounded p-4">
              <p className="text-sm text-gray-300">
                <strong>Recommendation:</strong> Your form is excellent today (TSB +34). This is an ideal time for a high-intensity interval session. Consider a session like 5×8min at Z4-Z5 zone.
              </p>
            </div>
            <div className="bg-dark border border-gray-700 rounded p-4">
              <p className="text-sm text-gray-300">
                <strong>Recovery Tip:</strong> Based on recent activity load, prioritize 8+ hours of sleep tonight. Post-ride nutrition: 60g CHO + 25g protein within 30 minutes.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
