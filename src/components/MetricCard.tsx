'use client';

interface MetricCardProps {
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendPercent?: number;
  color?: 'default' | 'strava' | 'success' | 'warning' | 'danger';
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  trendPercent,
  color = 'default',
}: MetricCardProps) {
  const colorClasses = {
    default: 'text-gray-100',
    strava: 'text-strava',
    success: 'text-green-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
  };

  const trendClasses = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-500',
  };

  return (
    <div className="card">
      <div className="metric-label">{label}</div>
      <div className="flex items-baseline gap-2 mt-2">
        <span className={`metric-value ${colorClasses[color]}`}>{value}</span>
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
      {trend && trendPercent !== undefined && (
        <div className={`text-sm mt-3 ${trendClasses[trend]}`}>
          {trend === 'up' ? '↑' : '↓'} {Math.abs(trendPercent)}%
        </div>
      )}
    </div>
  );
}
