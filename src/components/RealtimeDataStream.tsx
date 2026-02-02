import { useEffect, useState } from 'react';
import { Activity, Wifi, AlertCircle } from 'lucide-react';

interface DataPoint {
  timestamp: Date;
  temperature: number;
  humidity: number;
  pressure: number;
  status: 'online' | 'warning' | 'offline';
}

interface RealtimeDataStreamProps {
  deviceName?: string;
  onDataUpdate?: (data: DataPoint) => void;
}

export function RealtimeDataStream({ deviceName = 'Device 01', onDataUpdate }: RealtimeDataStreamProps) {
  const [dataStream, setDataStream] = useState<DataPoint[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newData: DataPoint = {
        timestamp: new Date(),
        temperature: 20 + Math.sin(Date.now() / 5000) * 5 + Math.random() * 2,
        humidity: 45 + Math.cos(Date.now() / 7000) * 15 + Math.random() * 3,
        pressure: 1013 + Math.sin(Date.now() / 10000) * 5 + Math.random() * 2,
        status: Math.random() > 0.95 ? 'warning' : 'online'
      };

      setDataStream((prev) => [...prev.slice(-19), newData]);
      onDataUpdate?.(newData);
    }, 800);

    return () => clearInterval(interval);
  }, [isLive, onDataUpdate]);

  const latestData = dataStream[dataStream.length - 1];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'offline':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'offline':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Activity className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">{deviceName} - Real-Time Stream</h3>
          {isLive && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-red-600 font-medium">LIVE</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`px-3 py-1 text-xs font-semibold rounded-full border transition-all ${
            isLive
              ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100'
              : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
          }`}
        >
          {isLive ? 'PAUSE' : 'RESUME'}
        </button>
      </div>

      {latestData && (
        <div className={`${getStatusBg(latestData.status)} border rounded-lg p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wifi className={`w-5 h-5 ${getStatusColor(latestData.status)}`} />
              <span className={`font-semibold capitalize ${getStatusColor(latestData.status)}`}>
                {latestData.status === 'online' ? 'Connected' : latestData.status === 'warning' ? 'Warning' : 'Disconnected'}
              </span>
            </div>
            <span className="text-xs text-gray-600">
              {latestData.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 mb-6">
        {latestData && (
          <>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-xs text-gray-600 font-medium mb-1">Temperature</p>
              <p className="text-2xl font-bold text-blue-600">{latestData.temperature.toFixed(1)}°C</p>
              <p className="text-xs text-gray-500 mt-1">
                {latestData.temperature > 25 ? '↑ Above' : latestData.temperature < 18 ? '↓ Below' : '= Normal'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg p-4 border border-cyan-200">
              <p className="text-xs text-gray-600 font-medium mb-1">Humidity</p>
              <p className="text-2xl font-bold text-cyan-600">{latestData.humidity.toFixed(1)}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {latestData.humidity > 70 ? '↑ High' : latestData.humidity < 30 ? '↓ Low' : '= Optimal'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p className="text-xs text-gray-600 font-medium mb-1">Pressure</p>
              <p className="text-2xl font-bold text-green-600">{latestData.pressure.toFixed(1)}hPa</p>
              <p className="text-xs text-gray-500 mt-1">Stable</p>
            </div>
          </>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-900">Live Data Stream (Last 20s)</p>
        <div className="space-y-2 max-h-64 overflow-y-auto bg-gray-50 rounded-lg p-3">
          {dataStream.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-8">Waiting for data...</p>
          ) : (
            [...dataStream].reverse().map((data, index) => (
              <div key={index} className="flex items-center justify-between text-xs border-b border-gray-200 pb-2 last:border-0">
                <span className="text-gray-600">{data.timestamp.toLocaleTimeString()}</span>
                <div className="flex items-center space-x-4">
                  <span className="font-mono">T: {data.temperature.toFixed(1)}°C</span>
                  <span className="font-mono">H: {data.humidity.toFixed(1)}%</span>
                  <span className="font-mono">P: {data.pressure.toFixed(1)}hPa</span>
                  <div className={`w-2 h-2 rounded-full ${data.status === 'online' ? 'bg-green-500' : data.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
