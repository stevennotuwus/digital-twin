import { useMemo } from 'react';
import type { SensorReading } from '../lib/database.types';

interface MiniChartProps {
  data: SensorReading[];
  color?: string;
}

export function MiniChart({ data, color = '#3B82F6' }: MiniChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return { points: '', max: 0, min: 0 };

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    const width = 100;
    const height = 60;
    const pointSpacing = width / (values.length - 1 || 1);

    const points = values
      .map((value, index) => {
        const x = index * pointSpacing;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
      })
      .join(' ');

    return { points, max, min };
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="w-full h-16 flex items-center justify-center text-gray-400 text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className="w-full h-16 relative">
      <svg viewBox="0 0 100 60" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={chartData.points}
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          fill={`url(#gradient-${color})`}
          points={`0,60 ${chartData.points} 100,60`}
        />
      </svg>
      <div className="absolute top-0 right-0 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        {chartData.max.toFixed(1)}
      </div>
      <div className="absolute bottom-0 right-0 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
        {chartData.min.toFixed(1)}
      </div>
    </div>
  );
}
