/**
 * Strava Activities Component
 * Displays recent activities synced from Strava
 */

'use client';

import { useEffect, useState } from 'react';
import { StravaActivity, useStravaActivities } from '@/hooks/useStrava';
import { formatDistance, formatTime } from '@/lib/utils';

interface StravaActivitiesProps {
  accessToken: string | null;
  limit?: number;
}

export function StravaActivities({
  accessToken,
  limit = 10,
}: StravaActivitiesProps) {
  const { activities, loading, error } = useStravaActivities(accessToken);
  const [displayActivities, setDisplayActivities] = useState<StravaActivity[]>([]);

  useEffect(() => {
    setDisplayActivities(activities.slice(0, limit));
  }, [activities, limit]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 text-center text-gray-400">
        Sincronizando actividades de Strava...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/50 text-red-400">
        Error al cargar actividades: {error}
      </div>
    );
  }

  if (displayActivities.length === 0) {
    return (
      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 text-center text-gray-400">
        No hay actividades registradas aún
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {displayActivities.map((activity) => (
        <div
          key={activity.id}
          className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/70 transition-colors"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-white font-semibold">{activity.name}</h3>
              <p className="text-sm text-gray-400">
                {new Date(activity.start_date).toLocaleDateString('es-ES', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <span className="px-3 py-1 bg-strava/20 text-strava text-xs font-medium rounded">
              {activity.type}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Distancia</p>
              <p className="text-white font-semibold">
                {formatDistance(activity.distance)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Duración</p>
              <p className="text-white font-semibold">
                {formatTime(activity.moving_time)}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Ganancia Vertical</p>
              <p className="text-white font-semibold">
                {activity.elevation_gain.toFixed(0)} m
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Energía</p>
              <p className="text-white font-semibold">
                {activity.kilojoules.toFixed(0)} kJ
              </p>
            </div>
          </div>

          {activity.average_watts && (
            <div className="mt-3 grid grid-cols-3 gap-3 text-sm border-t border-gray-700 pt-3">
              <div>
                <p className="text-gray-500 text-xs">Potencia Media</p>
                <p className="text-white font-semibold">
                  {activity.average_watts.toFixed(0)} W
                </p>
              </div>
              {activity.average_heartrate && (
                <div>
                  <p className="text-gray-500 text-xs">FC Media</p>
                  <p className="text-white font-semibold">
                    {activity.average_heartrate.toFixed(0)} bpm
                  </p>
                </div>
              )}
              {activity.average_cadence && (
                <div>
                  <p className="text-gray-500 text-xs">Cadencia Media</p>
                  <p className="text-white font-semibold">
                    {activity.average_cadence.toFixed(0)} rpm
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
