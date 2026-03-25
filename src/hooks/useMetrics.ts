import { useState, useEffect } from 'react';
import { StravaActivity } from './useStrava';
import { 
  calculateTSS, 
  calculateCTL, 
  calculateATL, 
  calculateTSB,
  calculateIntensityFactor
} from '@/lib/metrics';

export interface MetricsData {
  ctl: number;      // Fitness (Chronic Training Load)
  atl: number;      // Fatigue (Acute Training Load)
  tsb: number;      // Form (Training Stress Balance)
  ftp: number;      // Functional Threshold Power
  trendCTL: number; // Trend percentage
  trendATL: number;
  trendTSB: number;
  loading: boolean;
  error: string | null;
}

/**
 * Hook para calcular métricas reales de Strava
 */
export function useMetrics(activities: StravaActivity[]): MetricsData {
  const [metrics, setMetrics] = useState<MetricsData>({
    ctl: 62,
    atl: 28,
    tsb: 34,
    ftp: 380,
    trendCTL: 5.2,
    trendATL: -8.1,
    trendTSB: 12.5,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!activities || activities.length === 0) return;

    try {
      // Calculate FTP as 95th percentile of average_watts from recent rides
      const recentActivities = activities.slice(0, 30); // Last 30 rides
      const powerValues = recentActivities
        .filter(a => a.average_watts && a.average_watts > 0)
        .map(a => a.average_watts!)
        .sort((a, b) => b - a);

      const ftp = powerValues.length > 0
        ? Math.round(powerValues[Math.floor(powerValues.length * 0.75)] * 0.95)
        : 380;

      // Calculate TSS for each activity
      const tssHistory: number[] = [];
      let totalTSS = 0;
      
      activities.slice(0, 60).forEach((activity) => {
        // Estimate NP from average watts (simplified)
        const estimatedNP = activity.average_watts || 200;
        
        // Calculate TSS using duration and estimated metrics
        const tss = calculateTSS(
          activity.moving_time,
          estimatedNP,
          ftp
        );
        
        tssHistory.push(tss);
        if (tssHistory.length <= 7) {
          totalTSS += tss;
        }
      });

      // Calculate CTL, ATL, TSB
      const latestTSS = tssHistory[0] || 0;
      const ctl = calculateCTL(tssHistory.slice(1), latestTSS);
      const atl = calculateATL(tssHistory.slice(1), latestTSS);
      const tsb = calculateTSB(ctl, atl);

      // Calculate trends (compare with previous period)
      let previousCTL = ctl;
      let previousATL = atl;
      
      if (tssHistory.length > 21) {
        const previousTSSHistory = tssHistory.slice(14);
        const previousLatestTSS = previousTSSHistory[0] || latestTSS;
        previousCTL = calculateCTL(previousTSSHistory.slice(1), previousLatestTSS);
        previousATL = calculateATL(previousTSSHistory.slice(1), previousLatestTSS);
      }

      const trendCTL = previousCTL > 0 ? ((ctl - previousCTL) / previousCTL) * 100 : 0;
      const trendATL = previousATL > 0 ? ((atl - previousATL) / previousATL) * 100 : 0;
      const trendTSB = tsb - (ctl - atl);

      setMetrics({
        ctl: Math.round(ctl * 10) / 10,
        atl: Math.round(atl * 10) / 10,
        tsb: Math.round(tsb * 10) / 10,
        ftp: ftp,
        trendCTL: Math.round(trendCTL * 10) / 10,
        trendATL: Math.round(trendATL * 10) / 10,
        trendTSB: Math.round(trendTSB * 10) / 10,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error calculating metrics:', error);
      setMetrics(prev => ({
        ...prev,
        error: 'Error calculating metrics',
      }));
    }
  }, [activities]);

  return metrics;
}
