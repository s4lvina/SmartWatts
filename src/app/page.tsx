'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MetricCard } from '@/components/MetricCard';
import { PMCChart } from '@/components/PMCChart';
import { PowerDurationCurve } from '@/components/PowerDurationCurve';
import { ZoneDistribution } from '@/components/ZoneDistribution';
import { StravaActivities } from '@/components/StravaActivities';
import { useStravaActivities } from '@/hooks/useStrava';
import { createClient } from '@supabase/supabase-js';

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
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Hook para obtener actividades de Strava
  const { activities, loading: activitiesLoading, error: activitiesError } = useStravaActivities(
    user?.strava_access_token || null
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL || '',
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        );

        // Try to get user from localStorage or session
        const storedUser = typeof window !== 'undefined' 
          ? localStorage.getItem('smartwatts_user')
          : null;

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-strava"></div>
          <p className="mt-4 text-gray-400">Cargando dashboard...</p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-100 mb-4">Bienvenido a SmartWatts</h1>
          <p className="text-gray-400 mb-8">Conecta tu cuenta de Strava para ver tus datos de entrenamiento</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-strava text-white font-semibold rounded-lg hover:bg-strava/90 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-dark-secondary sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">SmartWatts</h1>
              <p className="text-gray-400 mt-1">Análisis de Rendimiento Ciclista</p>
              {user && <p className="text-sm text-strava mt-2">👋 ¡Hola, {user.name}!</p>}
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-dark-card border border-gray-700 text-gray-100 rounded px-3 py-2 text-sm focus:outline-none focus:border-strava"
              >
                <option value="week">Esta Semana</option>
                <option value="month">Este Mes</option>
                <option value="quarter">Este Trimestre</option>
                <option value="year">Este Año</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Data Status Alert */}
        {activitiesLoading ? (
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded text-blue-400 text-sm">
            ⏳ Sincronizando datos de Strava...
          </div>
        ) : activitiesError ? (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
            ⚠️ {activitiesError}
          </div>
        ) : activities.length > 0 ? (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded text-green-400 text-sm">
            ✅ {activities.length} actividades sincronizadas de Strava
          </div>
        ) : null}

        {/* KPI Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Métricas Actuales</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Forma Física (CTL)"
              value={62}
              unit="puntos"
              tendencia="up"
              porcentajeTendencia={5.2}
              color="success"
            />
            <MetricCard
              label="Fatiga (ATL)"
              value={28}
              unit="puntos"
              tendencia="down"
              porcentajeTendencia={8.1}
              color="default"
            />
            <MetricCard
              label="Forma (TSB)"
              value={34}
              unit="puntos"
              tendencia="up"
              porcentajeTendencia={12.5}
              color="strava"
            />
            <MetricCard
              label="FTP"
              value={380}
              unit="vatios"
              tendencia="neutral"
              color="default"
            />
          </div>
        </section>

        {/* Two Column Layout: 60/40 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Left Column - 60% (Strava Activities, Charts) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activities from Strava */}
            {!activitiesLoading && activities.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-100 mb-4">Actividades Recientes</h2>
                <StravaActivities accessToken={user?.strava_access_token} limit={10} />
              </section>
            )}

            {/* PMC Chart */}
            <section>
              <PMCChart data={mockPMCData} height={400} />
            </section>

            {/* Power Curve & Zones */}
            <div className="grid grid-cols-1 gap-6">
              <PowerDurationCurve data={mockPowerCurveData} height={350} ftp={380} />
            </div>
          </div>

          {/* Right Column - 40% (Coach Analysis, Key Info) */}
          <div className="lg:col-span-1 space-y-6">
            {/* Coach Section */}
            <section className="card sticky top-24">
              <div className="card-header">
                <h2 className="card-title">📊 Análisis del Entrenador IA</h2>
              </div>
              <div className="space-y-4">
                <div className="bg-dark border border-gray-700 rounded p-4">
                  <p className="text-sm text-gray-300">
                    <strong>Recomendación:</strong> Tu forma está excelente hoy (TSB +34). Este es el momento ideal para una sesión de alta intensidad. Considera una sesión como 5×8min en zona Z4-Z5.
                  </p>
                </div>
                <div className="bg-dark border border-gray-700 rounded p-4">
                  <p className="text-sm text-gray-300">
                    <strong>Consejo de Recuperación:</strong> Basado en la carga de actividad reciente, prioriza 8+ horas de sueño esta noche. Nutrición post-entrenamiento: 60g CHO + 25g proteína dentro de 30 minutos.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Full Width Section - Heart Rate Zones */}
        <section className="mb-12">
          <ZoneDistribution
            data={mockHRZoneData}
            title="Distribución de Zonas de Frecuencia Cardíaca"
            height={300}
          />
        </section>
      </div>
    </main>
  );
}
