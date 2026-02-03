import { TrendingUp } from 'lucide-react';

interface ComparisonData {
  label: string;
  value: number;
  target: number;
  percentage: number;
}

interface PerformanceComparisonProps {
  timeRange?: 'today' | 'week' | 'month';
}

export function PerformanceComparison({ timeRange = 'today' }: PerformanceComparisonProps) {
  const comparisonData: ComparisonData[] = [
    { label: 'API Response Time', value: 45, target: 50, percentage: 90 },
    { label: 'Data Throughput', value: 2850, target: 3000, percentage: 95 },
    { label: 'Device Uptime', value: 99.8, target: 99.9, percentage: 99.9 },
    { label: 'Error Rate', value: 0.15, target: 0.5, percentage: 30 },
    { label: 'Cache Hit Ratio', value: 87.5, target: 85, percentage: 102 },
    { label: 'Query Performance', value: 125, target: 150, percentage: 83 },
  ];

  const getPerformanceStatus = (percentage: number): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (percentage >= 95) return 'excellent';
    if (percentage >= 85) return 'good';
    if (percentage >= 70) return 'fair';
    return 'poor';
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-green-50';
      case 'good':
        return 'bg-blue-50';
      case 'fair':
        return 'bg-yellow-50';
      case 'poor':
        return 'bg-red-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-700';
      case 'good':
        return 'text-blue-700';
      case 'fair':
        return 'text-yellow-700';
      case 'poor':
        return 'text-red-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Performance vs Target</h3>
        <div className="flex items-center space-x-2">
          <button className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            timeRange === 'today' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
          }`}>
            Today
          </button>
          <button className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            timeRange === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
          }`}>
            Week
          </button>
          <button className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            timeRange === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
          }`}>
            Month
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comparisonData.map((item, index) => {
          const status = getPerformanceStatus(item.percentage);
          const isMeeting = item.percentage >= 100;

          return (
            <div key={index} className={`${getStatusBg(status)} border border-gray-200/50 rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{item.label}</h4>
                  <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                    isMeeting ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    <span>{item.percentage.toFixed(0)}%</span>
                  </div>
                </div>
                <span className={`text-sm font-bold ${getStatusColor(status)}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Current: {item.value} | Target: {item.target}</span>
                  <span className="font-medium">{((item.value / item.target) * 100).toFixed(0)}% of target</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      status === 'excellent' ? 'bg-green-500' :
                      status === 'good' ? 'bg-blue-500' :
                      status === 'fair' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${Math.min((item.value / item.target) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">24</p>
            <p className="text-xs text-gray-600">Metrics Above</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">18</p>
            <p className="text-xs text-gray-600">On Target</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">6</p>
            <p className="text-xs text-gray-600">Minor Issues</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">0</p>
            <p className="text-xs text-gray-600">Critical</p>
          </div>
        </div>
      </div>
    </div>
  );
}
