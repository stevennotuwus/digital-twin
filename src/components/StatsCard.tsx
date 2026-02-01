import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'yellow' | 'red';
}

export function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-400',
    green: 'from-green-500 to-emerald-400',
    yellow: 'from-yellow-500 to-orange-400',
    red: 'from-red-500 to-pink-400',
  };

  const bgClasses = {
    blue: 'from-blue-50 to-cyan-50',
    green: 'from-green-50 to-emerald-50',
    yellow: 'from-yellow-50 to-orange-50',
    red: 'from-red-50 to-pink-50',
  };

  return (
    <div className={`bg-gradient-to-br ${bgClasses[color]} rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
