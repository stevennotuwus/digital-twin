import { X, Activity, Calendar, MapPin, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Device, SensorReading, DeviceAlert } from '../lib/database.types';
import { MiniChart } from './MiniChart';

interface DeviceDetailProps {
  device: Device;
  onClose: () => void;
}

export function DeviceDetail({ device, onClose }: DeviceDetailProps) {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [alerts, setAlerts] = useState<DeviceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeviceData();
  }, [device.id]);

  async function loadDeviceData() {
    setLoading(true);
    const [readingsRes, alertsRes] = await Promise.all([
      supabase
        .from('sensor_readings')
        .select('*')
        .eq('device_id', device.id)
        .order('timestamp', { ascending: false })
        .limit(50),
      supabase
        .from('device_alerts')
        .select('*')
        .eq('device_id', device.id)
        .order('created_at', { ascending: false })
        .limit(10),
    ]);

    if (readingsRes.data) setReadings(readingsRes.data);
    if (alertsRes.data) setAlerts(alertsRes.data);
    setLoading(false);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'info':
        return 'text-blue-600 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const latestReading = readings[0];
  const chartData = [...readings].reverse().slice(-30);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{device.name}</h2>
              <p className="text-sm text-gray-500 capitalize">{device.type.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">Status</span>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(device.status)}`}>
                {device.status}
              </span>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">Location</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">{device.location || 'N/A'}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">Last Seen</span>
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {device.last_seen ? new Date(device.last_seen).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>

          {latestReading && (
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Current Reading</h3>
                  <p className="text-4xl font-bold text-gray-900">
                    {latestReading.value.toFixed(2)}
                    <span className="text-xl text-gray-600 ml-2">{latestReading.unit}</span>
                  </p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-600" />
              </div>
            </div>
          )}

          {chartData.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Historical Data (Last 30 readings)</h3>
              <MiniChart data={chartData} color="#3B82F6" />
            </div>
          )}

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Alerts</h3>
            {loading ? (
              <p className="text-gray-500">Loading alerts...</p>
            ) : alerts.length === 0 ? (
              <p className="text-gray-500">No alerts for this device</p>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} ${alert.resolved ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-semibold capitalize">{alert.severity}</span>
                          {alert.resolved && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                              Resolved
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(alert.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Readings</h3>
            {loading ? (
              <p className="text-gray-500">Loading readings...</p>
            ) : readings.length === 0 ? (
              <p className="text-gray-500">No readings available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Metric</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {readings.slice(0, 10).map((reading) => (
                      <tr key={reading.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {new Date(reading.timestamp).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 capitalize">
                          {reading.metric_name.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {reading.value.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{reading.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
