/**
 * Strava Activities Component
 * Displays recent activities synced from Strava in table format with pagination
 */

'use client';

import { useEffect, useState } from 'react';
import { StravaActivity, useStravaActivities } from '@/hooks/useStrava';
import { formatDistance, formatTime } from '@/lib/utils';

interface StravaActivitiesProps {
  accessToken: string | null;
  itemsPerPage?: number;
}

export function StravaActivities({
  accessToken,
  itemsPerPage = 10,
}: StravaActivitiesProps) {
  const { activities, loading, error } = useStravaActivities(accessToken);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayActivities, setDisplayActivities] = useState<StravaActivity[]>([]);

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    setDisplayActivities(activities.slice(startIndex, endIndex));
  }, [activities, startIndex, endIndex]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

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

  if (activities.length === 0) {
    return (
      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700 text-center text-gray-400">
        No hay actividades registradas aún
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-900/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-gray-300 font-semibold">Actividad</th>
                <th className="px-6 py-3 text-left text-gray-300 font-semibold">Fecha</th>
                <th className="px-6 py-3 text-center text-gray-300 font-semibold">Distancia</th>
                <th className="px-6 py-3 text-center text-gray-300 font-semibold">Duración</th>
                <th className="px-6 py-3 text-center text-gray-300 font-semibold">Energía</th>
                <th className="px-6 py-3 text-center text-gray-300 font-semibold">Potencia</th>
                <th className="px-6 py-3 text-center text-gray-300 font-semibold">FC Prom</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {displayActivities.map((activity) => (
                <tr
                  key={activity.id}
                  className="hover:bg-gray-700/30 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-strava/20 text-strava text-xs font-medium rounded">
                        {activity.type}
                      </span>
                      <span className="truncate max-w-xs">{activity.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400 whitespace-nowrap">
                    {new Date(activity.start_date).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-100 font-medium">
                    {formatDistance(activity.distance)}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-100 font-medium">
                    {formatTime(activity.moving_time)}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-100 font-medium">
                    {activity.kilojoules.toFixed(0)} kJ
                  </td>
                  <td className="px-6 py-4 text-center text-gray-100 font-medium">
                    {activity.average_watts ? `${activity.average_watts.toFixed(0)} W` : '-'}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-100 font-medium">
                    {activity.average_heartrate ? `${activity.average_heartrate.toFixed(0)} bpm` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800/30 border border-gray-700 rounded-lg">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-700 text-gray-100 rounded enabled:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            ← Anterior
          </button>
          <div className="text-gray-400 text-sm">
            Página <span className="font-semibold text-gray-100">{currentPage}</span> de{' '}
            <span className="font-semibold text-gray-100">{totalPages}</span>
            {' '} | Total: {activities.length} actividades
          </div>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-700 text-gray-100 rounded enabled:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
