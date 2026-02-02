import { TrendingUp, TrendingDown } from 'lucide-react';

interface RealTimeMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  sparkline?: number[];
  status?: 'good' | 'warning' | 'critical';
}

export function RealTimeMetric({
  label,
  value,
  unit = '',
  trend,
  sparkline,
  status = 'good'
}: RealTimeMetricProps) {
  const statusColor = {
    good: 'text-green-600',
    warning: 'text-yellow-600',
    critical: 'text-red-600'
  };

  const statusBgColor = {
    good: 'bg-green-50',
    warning: 'bg-yellow-50',
    critical: 'bg-red-50'
  };

  const statusBorder = {
    good: 'border-green-200',
    warning: 'border-yellow-200',
    critical: 'border-red-200'
  };

  const max = sparkline ? Math.max(...sparkline) : 100;
  const min = sparkline ? Math.min(...sparkline) : 0;
  const range = max - min || 1;

  return (
    <div className={`${statusBgColor[status]} border ${statusBorder[status]} rounded-lg p-4`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-600">{label}</p>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-xs font-semibold">{trend.value}%</span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="flex items-baseline space-x-1">
          <span className={`text-2xl font-bold ${statusColor[status]}`}>{value}</span>
          {unit && <span className="text-sm text-gray-600">{unit}</span>}
        </div>
      </div>

      {sparkline && (
        <div className="flex items-end justify-between space-x-1 h-12">
          {sparkline.map((data, index) => (
            <div
              key={index}
              className={`flex-1 rounded-t ${statusColor[status]} opacity-60 hover:opacity-100 transition-opacity`}
              style={{
                height: `${((data - min) / range) * 100 || 5}%`,
                backgroundColor: status === 'good' ? '#16a34a' : status === 'warning' ? '#ca8a04' : '#dc2626'
              }}
            />
          ))}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-2">
        Live · Last 24h
      </div>
    </div>
  );
}
