/**
 * Utility functions for date, formatting, and calculations
 */

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export function formatDistance(meters: number): string {
  const km = meters / 1000;
  if (km >= 1) {
    return `${(km).toFixed(2)} km`;
  }
  return `${meters.toFixed(0)} m`;
}

export function formatElevation(meters: number): string {
  return `${meters.toFixed(0)} m`;
}

export function formatPower(watts: number): string {
  return `${watts} W`;
}

export function formatHeartRate(bpm: number): string {
  return `${bpm} bpm`;
}

export function getZoneColor(zone: number): string {
  const colors: Record<number, string> = {
    1: '#10b981', // Green
    2: '#06b6d4', // Cyan
    3: '#3b82f6', // Blue
    4: '#f59e0b', // Amber
    5: '#ef4444', // Red
    6: '#dc2626', // Dark Red
    7: '#7c3aed', // Violet
  };
  return colors[zone] || '#6b7280';
}

export function getZoneName(zone: number, type: 'power' | 'hr' = 'power'): string {
  if (type === 'power') {
    const zones: Record<number, string> = {
      1: 'Active Recovery',
      2: 'Endurance',
      3: 'Tempo',
      4: 'Threshold',
      5: 'VO2 Max',
      6: 'Anaerobic Capacity',
      7: 'Neuromuscular',
    };
    return zones[zone] || 'Unknown';
  }
  return '';
}

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function getDaysSince(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const diff = today.getTime() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay()) / 7);
}

export function getTrendPercentage(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}
