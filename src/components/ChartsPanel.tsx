/**
 * Charts Panel Component
 * Tabbed interface for navigating between different charts
 */

'use client';

import { useState } from 'react';
import { PMCChart } from './PMCChart';
import { PowerDurationCurve } from './PowerDurationCurve';
import { ZoneDistribution } from './ZoneDistribution';

interface ChartsPanelProps {
  mockPMCData: any[];
  mockPowerCurveData: any[];
  mockPowerZoneData: any[];
  mockHRZoneData: any[];
}

type TabType = 'pmc' | 'power' | 'zones';

export function ChartsPanel({
  mockPMCData,
  mockPowerCurveData,
  mockPowerZoneData,
  mockHRZoneData,
}: ChartsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('pmc');

  const tabs: Array<{ id: TabType; label: string; icon: string }> = [
    { id: 'pmc', label: 'PMC', icon: '📈' },
    { id: 'power', label: 'Potencia', icon: '⚡' },
    { id: 'zones', label: 'Zonas', icon: '🎯' },
  ];

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden flex flex-col h-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-gray-900/30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-strava text-strava bg-gray-800/50'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'pmc' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Gráfico de Gestión del Rendimiento</h3>
            <PMCChart data={mockPMCData} height={250} />
          </div>
        )}

        {activeTab === 'power' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Curva de Potencia</h3>
            <PowerDurationCurve data={mockPowerCurveData} height={250} ftp={380} />
          </div>
        )}

        {activeTab === 'zones' && (
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Distribución de Zonas</h3>
            <ZoneDistribution
              data={mockPowerZoneData}
              title="Zonas de Potencia"
              height={250}
            />
          </div>
        )}
      </div>
    </div>
  );
}
