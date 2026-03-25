import { useState, useEffect } from 'react';
import axios from 'axios';

export interface StravaActivity {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  elevation_gain: number;
  start_date: string;
  average_speed: number;
  max_speed: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  kilojoules: number;
  average_watts?: number;
  map?: string;
  polyline?: string;
}

interface UseStravaActivitiesReturn {
  activities: StravaActivity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para obtener actividades recientes de Strava
 * @param accessToken Token de acceso de Strava
 * @returns Actividades, estado de carga y funciones
 */
export function useStravaActivities(
  accessToken: string | null
): UseStravaActivitiesReturn {
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    if (!accessToken) {
      setError('No access token available');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('/api/strava/activities', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setActivities(response.data.activities || []);
    } catch (err: any) {
      console.error('Error fetching Strava activities:', err);
      setError(
        err.response?.data?.message ||
          'Error al obtener actividades de Strava'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchActivities();
    }
  }, [accessToken]);

  return {
    activities,
    loading,
    error,
    refetch: fetchActivities,
  };
}

/**
 * Hook para refrescar token de Strava
 * @param refreshToken Token de actualización de Strava
 * @returns Nuevos tokens
 */
export async function refreshStravaToken(refreshToken: string) {
  try {
    const response = await axios.post('/api/strava/refresh-token', {
      refresh_token: refreshToken,
    });

    return {
      access_token: response.data.access_token,
      refresh_token: response.data.refresh_token,
      expires_at: response.data.expires_at,
    };
  } catch (error) {
    console.error('Error refreshing Strava token:', error);
    throw error;
  }
}
