import { Activity, BarChart3, Home, Settings, AlertTriangle } from 'lucide-react';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

export function Sidebar({ activeView, setActiveView }: SidebarProps) {
  const menuItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'devices', icon: Activity, label: 'Devices' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'alerts', icon: AlertTriangle, label: 'Alerts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white h-screen fixed left-0 top-0 shadow-2xl">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Digital Twin</h1>
            <p className="text-xs text-slate-400">IoT Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/30'
                  : 'hover:bg-slate-700/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">System Status</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
