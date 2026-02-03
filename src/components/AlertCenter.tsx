import { AlertTriangle, AlertCircle, Zap, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  deviceName: string;
  timestamp: Date;
  resolved: boolean;
  resolutionTime?: number;
}

interface AlertCenterProps {
  maxItems?: number;
}

export function AlertCenter({ maxItems = 10 }: AlertCenterProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  useEffect(() => {
    generateMockAlerts();
  }, []);

  const generateMockAlerts = () => {
    const devices = ['Sensor A1', 'Sensor B2', 'Gateway D1', 'Actuator E1', 'Meter G1', 'Camera F1'];
    const alertTemplates = [
      { title: 'High Temperature', message: 'Device temperature exceeded threshold' },
      { title: 'Connection Lost', message: 'Device lost connection to network' },
      { title: 'High Humidity', message: 'Humidity level critically high' },
      { title: 'Power Low', message: 'Battery level is low' },
      { title: 'System Error', message: 'Device encountered internal error' },
      { title: 'Data Anomaly', message: 'Unusual readings detected' },
      { title: 'Memory Warning', message: 'Device memory usage is high' },
      { title: 'Sensor Drift', message: 'Sensor calibration might be off' },
    ];

    const newAlerts: Alert[] = [];

    for (let i = 0; i < Math.min(maxItems, 8); i++) {
      const severity = Math.random();
      const type = severity > 0.6 ? 'critical' : severity > 0.3 ? 'warning' : 'info';
      const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
      const device = devices[Math.floor(Math.random() * devices.length)];

      newAlerts.push({
        id: `alert-${i}-${Date.now()}`,
        type: type as 'critical' | 'warning' | 'info',
        title: template.title,
        message: template.message,
        deviceName: device,
        timestamp: new Date(Date.now() - Math.random() * 600000),
        resolved: Math.random() > 0.7,
        resolutionTime: Math.random() > 0.7 ? Math.random() * 300000 : undefined
      });
    }

    setAlerts(newAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  };

  const dismissAlert = (id: string) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  const resolveAlert = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, resolved: true, resolutionTime: Date.now() } : alert
    ));
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.includes(alert.id));
  const criticalCount = visibleAlerts.filter(a => a.type === 'critical' && !a.resolved).length;
  const warningCount = visibleAlerts.filter(a => a.type === 'warning' && !a.resolved).length;
  const resolvedCount = visibleAlerts.filter(a => a.resolved).length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string, resolved: boolean) => {
    if (resolved) return 'bg-gray-50 border-gray-200';
    switch (type) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getAlertTextColor = (type: string, resolved: boolean) => {
    if (resolved) return 'text-gray-700';
    switch (type) {
      case 'critical':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      default:
        return 'text-blue-700';
    }
  };

  const getAlertIconColor = (type: string, resolved: boolean) => {
    if (resolved) return 'text-gray-500';
    switch (type) {
      case 'critical':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Alert Center</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">{criticalCount} Critical</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">{warningCount} Warnings</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-gray-600">{resolvedCount} Resolved</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {visibleAlerts.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-600">No alerts at this time</p>
          </div>
        ) : (
          visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`${getAlertColor(alert.type, alert.resolved)} border rounded-lg p-4 hover:shadow-md transition-all ${
                alert.resolved ? 'opacity-75' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className={`${getAlertIconColor(alert.type, alert.resolved)} mt-0.5 flex-shrink-0`}>
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className={`font-semibold ${getAlertTextColor(alert.type, alert.resolved)}`}>
                        {alert.title}
                      </p>
                      {alert.resolved && (
                        <span className="text-xs bg-gray-300/50 text-gray-700 px-2 py-0.5 rounded-full">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{alert.message}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="font-medium">{alert.deviceName}</span>
                      <span>
                        {Math.round((Date.now() - alert.timestamp.getTime()) / 60000)}m ago
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="text-xs font-semibold px-3 py-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700 py-2">
          View Alert History
        </button>
      </div>
    </div>
  );
}
