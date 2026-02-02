interface PerformanceChartProps {
  title: string;
  data: number[];
  labels: string[];
  color: 'blue' | 'green' | 'red' | 'yellow';
  unit?: string;
}

export function PerformanceChart({ title, data, labels, color, unit = '' }: PerformanceChartProps) {
  const max = Math.max(...data, 100);
  const colorMap = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    yellow: 'from-yellow-500 to-yellow-600',
  };

  const barColor = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };

  const accentColor = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="space-y-6">
        <div className="space-y-3">
          {data.map((value, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{labels[index]}</span>
                <span className={`text-sm font-semibold ${accentColor[color]}`}>
                  {value}{unit}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colorMap[color]} rounded-full transition-all duration-300`}
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
