import { useState, useEffect } from 'react';
import { Activity, Server, AlertTriangle, TrendingUp, Plus } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { DeviceCard } from './components/DeviceCard';
import { DeviceDetail } from './components/DeviceDetail';
import { DeviceManagementModal } from './components/DeviceManagementModal';
import { StatsCard } from './components/StatsCard';
import { UserProfile } from './components/UserProfile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import type { Device } from './lib/database.types';

function Dashboard() {
  const [activeView, setActiveView] = useState('overview');
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [managementDevice, setManagementDevice] = useState<Device | null | undefined>(undefined);
  const [latestReadings, setLatestReadings] = useState<Record<string, { value: number; unit: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDevices();

    const subscription = supabase
      .channel('device-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
        loadDevices();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sensor_readings' }, () => {
        loadDevices();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function loadDevices() {
    const { data: devicesData } = await supabase
      .from('devices')
      .select('*')
      .order('name');

    if (devicesData) {
      setDevices(devicesData);

      const readingsPromises = devicesData.map(async (device) => {
        const { data } = await supabase
          .from('sensor_readings')
          .select('value, unit')
          .eq('device_id', device.id)
          .order('timestamp', { ascending: false })
          .limit(1)
          .maybeSingle();

        return { deviceId: device.id, reading: data };
      });

      const readingsResults = await Promise.all(readingsPromises);
      const readingsMap: Record<string, { value: number; unit: string }> = {};

      readingsResults.forEach((result) => {
        if (result.reading) {
          readingsMap[result.deviceId] = result.reading;
        }
      });

      setLatestReadings(readingsMap);
    }

    setLoading(false);
  }

  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const warningDevices = devices.filter((d) => d.status === 'warning').length;
  const offlineDevices = devices.filter((d) => d.status === 'offline').length;

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Monitor and manage your IoT device infrastructure in real-time</p>
        </div>
        <button
          onClick={() => setManagementDevice(null)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          <span>Add Device</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Devices"
          value={devices.length}
          icon={Server}
          color="blue"
        />
        <StatsCard
          title="Online Devices"
          value={onlineDevices}
          icon={Activity}
          color="green"
        />
        <StatsCard
          title="Warnings"
          value={warningDevices}
          icon={AlertTriangle}
          color="yellow"
        />
        <StatsCard
          title="Offline"
          value={offlineDevices}
          icon={TrendingUp}
          color="red"
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Active Devices</h2>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : devices.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No devices yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding your first IoT device</p>
            <button
              onClick={() => setManagementDevice(null)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-5 h-5" />
              <span>Add Your First Device</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices.slice(0, 6).map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                latestReading={latestReadings[device.id]}
                onClick={() => setSelectedDevice(device)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderDevices = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Devices</h1>
          <p className="text-gray-600">Complete list of registered IoT devices</p>
        </div>
        <button
          onClick={() => setManagementDevice(null)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-5 h-5" />
          <span>Add Device</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : devices.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No devices yet</h3>
          <p className="text-gray-600 mb-6">Get started by adding your first IoT device</p>
          <button
            onClick={() => setManagementDevice(null)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            <span>Add Your First Device</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device) => (
            <div key={device.id} className="relative group">
              <DeviceCard
                device={device}
                latestReading={latestReadings[device.id]}
                onClick={() => setSelectedDevice(device)}
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setManagementDevice(device);
                }}
                className="absolute top-4 right-4 p-2 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-white"
              >
                <Activity className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-600">Device performance metrics and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Avg Response Time"
          value="45ms"
          icon={Activity}
          trend={{ value: '8%', isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Data Points"
          value="12.5K"
          icon={TrendingUp}
          trend={{ value: '23%', isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Uptime"
          value="99.8%"
          icon={Server}
          trend={{ value: '0.2%', isPositive: true }}
          color="green"
        />
        <StatsCard
          title="Alerts Resolved"
          value="87%"
          icon={AlertTriangle}
          trend={{ value: '5%', isPositive: true }}
          color="blue"
        />
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Performance</h2>
        <p className="text-gray-600">Detailed analytics coming soon...</p>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alerts & Notifications</h1>
        <p className="text-gray-600">Monitor system alerts and device warnings</p>
      </div>

      {warningDevices > 0 || offlineDevices > 0 ? (
        <>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Active Warnings</h3>
                <p className="text-yellow-800 text-sm">
                  {warningDevices + offlineDevices} device{warningDevices + offlineDevices !== 1 ? 's' : ''} reporting issues. Click on device cards to view details.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {devices
              .filter((d) => d.status === 'warning' || d.status === 'offline')
              .map((device) => (
                <DeviceCard
                  key={device.id}
                  device={device}
                  latestReading={latestReadings[device.id]}
                  onClick={() => setSelectedDevice(device)}
                />
              ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl p-12 border border-gray-200 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Clear!</h3>
          <p className="text-gray-600">No active alerts or warnings at this time</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {activeView === 'overview' && renderOverview()}
          {activeView === 'devices' && renderDevices()}
          {activeView === 'analytics' && renderAnalytics()}
          {activeView === 'alerts' && renderAlerts()}
          {activeView === 'profile' && <UserProfile />}
        </div>
      </div>

      {selectedDevice && (
        <DeviceDetail
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
        />
      )}

      {managementDevice !== undefined && (
        <DeviceManagementModal
          device={managementDevice || undefined}
          onClose={() => setManagementDevice(undefined)}
          onSave={() => {
            loadDevices();
            setManagementDevice(undefined);
          }}
        />
      )}
    </div>
  );
}

function App() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <ProtectedRoute
        fallback={
          showRegister ? (
            <Register onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <Login onSwitchToRegister={() => setShowRegister(true)} />
          )
        }
      >
        <Dashboard />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
