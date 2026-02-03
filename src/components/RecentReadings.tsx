import { TrendingUp, TrendingDown, Zap } from 'lucide-react';

interface Reading {
  id: string;
  deviceName: string;
  deviceType: string;
  metric: string;
  value: number;
  unit: string;
  timestamp: Date;
  trend?: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
}

interface RecentReadingsProps {
  readings?: Reading[];
  maxItems?: number;
}

export function RecentReadings({ maxItems = 8 }: RecentReadingsProps) {
  const generateMockReadings = (): Reading[] => {
    const devices = [
      { name: 'Sensor A1', type: 'Temperature' },
      { name: 'Sensor B2', type: 'Humidity' },
      { name: 'Sensor C3', type: 'Pressure' },
      { name: 'Gateway D1', type: 'Network' },
      { name: 'Actuator E1', type: 'Control' },
      { name: 'Camera F1', type: 'Video' },
      { name: 'Meter G1', type: 'Power' },
      { name: 'Sensor H2', type: 'Temperature' },
    ];

    return devices.slice(0, maxItems).map((device, index) => {
      const value = Math.random() * 100;
      const trend = value > 60 ? 'up' : value < 40 ? 'down' : 'stable';
      const status = value > 80 ? 'critical' : value > 60 ? 'warning' : 'normal';

      return {
        id: `reading-${index}`,
        deviceName: device.name,
        deviceType: device.type,
        metric: device.type === 'Temperature' ? 'Temp' : device.type === 'Humidity' ? 'Humidity' : 'Reading',
        value: parseFloat(value.toFixed(1)),
        unit: device.type === 'Temperature' ? '°C' : device.type === 'Humidity' ? '%' : 'unit',
        timestamp: new Date(Date.now() - Math.random() * 300000),
        trend: trend as 'up' | 'down' | 'stable',
        status: status as 'normal' | 'warning' | 'critical'
      };
    });
  };

  const readings = generateMockReadings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-700';
      case 'warning':
        return 'text-yellow-700';
      case 'critical':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <Zap className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Device Readings</h3>

      <div className="space-y-3">
        {readings.map((reading) => (
          <div
            key={reading.id}
            className={`${getStatusColor(reading.status)} border rounded-lg p-4 hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-semibold text-gray-900 truncate">{reading.deviceName}</p>
                  <span className="text-xs text-gray-500 bg-gray-200/50 px-2 py-0.5 rounded-full">
                    {reading.deviceType}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-600">
                    {reading.timestamp.toLocaleTimeString()}
                  </span>
                  <span className="text-xs text-gray-500">
                    {Math.round((Date.now() - reading.timestamp.getTime()) / 60000)}m ago
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 ml-4">
                <div className="text-right">
                  <div className="flex items-baseline space-x-1">
                    <span className={`text-2xl font-bold ${getStatusTextColor(reading.status)}`}>
                      {reading.value}
                    </span>
                    <span className="text-xs text-gray-600">{reading.unit}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{reading.status}</p>
                </div>

                <div className="flex items-center justify-center w-8 h-8 bg-white/50 rounded-full">
                  {getTrendIcon(reading.trend)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2">
          View All Readings
        </button>
      </div>
    </div>
  );
}
