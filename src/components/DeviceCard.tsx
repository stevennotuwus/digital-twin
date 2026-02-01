import { Activity, MapPin, Clock, TrendingUp } from 'lucide-react';
import type { Device } from '../lib/database.types';

interface DeviceCardProps {
  device: Device;
  latestReading?: { value: number; unit: string };
  onClick: () => void;
}

export function DeviceCard({ device, latestReading, onClick }: DeviceCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      online: 'bg-green-100 text-green-700 border-green-200',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      offline: 'bg-red-100 text-red-700 border-red-200',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatLastSeen = (lastSeen: string | null) => {
    if (!lastSeen) return 'Never';
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 text-left w-full group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className={`absolute -top-1 -right-1 w-4 h-4 ${getStatusColor(device.status)} rounded-full border-2 border-white ${device.status === 'online' ? 'animate-pulse' : ''}`}></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{device.name}</h3>
            <p className="text-sm text-gray-500 capitalize">{device.type.replace('_', ' ')}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(device.status)} capitalize`}>
          {device.status}
        </span>
      </div>

      {latestReading && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Current Reading</p>
              <p className="text-3xl font-bold text-gray-900">
                {latestReading.value.toFixed(1)}
                <span className="text-lg text-gray-500 ml-1">{latestReading.unit}</span>
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {device.location && (
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{device.location}</span>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-gray-400" />
          <span>Last seen {formatLastSeen(device.last_seen)}</span>
        </div>
      </div>
    </button>
  );
}
