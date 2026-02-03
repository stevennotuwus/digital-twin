import { Activity, Wifi, Battery, Thermometer } from 'lucide-react';

interface DeviceHealthMetrics {
  id: string;
  name: string;
  type: string;
  connection: number;
  performance: number;
  memory: number;
  temperature: number;
  battery?: number;
}

interface DeviceHealthProps {
  maxItems?: number;
}

export function DeviceHealth({ maxItems = 6 }: DeviceHealthProps) {
  const generateMockHealthData = (): DeviceHealthMetrics[] => {
    const devices = [
      { name: 'Sensor A1', type: 'Temperature' },
      { name: 'Sensor B2', type: 'Humidity' },
      { name: 'Gateway D1', type: 'Network' },
      { name: 'Actuator E1', type: 'Control' },
      { name: 'Meter G1', type: 'Power' },
      { name: 'Camera F1', type: 'Video' },
    ];

    return devices.slice(0, maxItems).map((device, index) => ({
      id: `health-${index}`,
      name: device.name,
      type: device.type,
      connection: 85 + Math.random() * 15,
      performance: 70 + Math.random() * 30,
      memory: 40 + Math.random() * 40,
      temperature: 35 + Math.random() * 20,
      battery: device.type === 'Sensor' ? 60 + Math.random() * 40 : undefined
    }));
  };

  const devices = generateMockHealthData();

  const getHealthStatus = (value: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (value >= 85) return 'excellent';
    if (value >= 70) return 'good';
    if (value >= 50) return 'warning';
    return 'critical';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const HealthBar = ({ value, label }: { value: number; label: string }) => {
    const status = getHealthStatus(value);
    const bgColor = status === 'excellent' ? 'bg-green-100' : status === 'good' ? 'bg-blue-100' : status === 'warning' ? 'bg-yellow-100' : 'bg-red-100';
    const barColor = status === 'excellent' ? 'bg-green-500' : status === 'good' ? 'bg-blue-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500';

    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-gray-600">{label}</span>
          <span className={`text-xs font-bold ${getStatusColor(status)}`}>
            {value.toFixed(0)}%
          </span>
        </div>
        <div className={`w-full h-1.5 ${bgColor} rounded-full overflow-hidden`}>
          <div
            className={`h-full ${barColor} transition-all duration-300`}
            style={{ width: `${Math.min(value, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Device Health Status</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => {
          const overallHealth = (device.connection + device.performance + device.memory) / 3;
          const healthStatus = getHealthStatus(overallHealth);

          return (
            <div
              key={device.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">{device.name}</h4>
                  <p className="text-xs text-gray-500">{device.type}</p>
                </div>
                <div className={`text-center p-2 rounded-full ${
                  healthStatus === 'excellent' ? 'bg-green-100' :
                  healthStatus === 'good' ? 'bg-blue-100' :
                  healthStatus === 'warning' ? 'bg-yellow-100' :
                  'bg-red-100'
                }`}>
                  <Activity className={`w-4 h-4 ${
                    healthStatus === 'excellent' ? 'text-green-600' :
                    healthStatus === 'good' ? 'text-blue-600' :
                    healthStatus === 'warning' ? 'text-yellow-600' :
                    'text-red-600'
                  }`} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs text-gray-600 mb-3">
                  <div className={`w-2 h-2 rounded-full ${
                    healthStatus === 'excellent' ? 'bg-green-500' :
                    healthStatus === 'good' ? 'bg-blue-500' :
                    healthStatus === 'warning' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}></div>
                  <span className="font-medium capitalize">{healthStatus} Health</span>
                </div>

                <HealthBar value={device.connection} label="Connection" />
                <HealthBar value={device.performance} label="Performance" />
                <HealthBar value={device.memory} label="Memory" />

                <div className="pt-2 border-t border-gray-100 mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Thermometer className="w-3 h-3" />
                      <span>{device.temperature.toFixed(0)}°C</span>
                    </div>
                    {device.battery !== undefined && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Battery className="w-3 h-3" />
                        <span>{device.battery.toFixed(0)}%</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-green-600">
                      <Wifi className="w-3 h-3" />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2">
          View Detailed Health Report
        </button>
      </div>
    </div>
  );
}
