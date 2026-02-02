interface LineChartProps {
  title: string;
  data: number[];
  labels: string[];
  color: 'blue' | 'green' | 'red' | 'yellow' | 'cyan';
}

export function LineChart({ title, data, labels, color }: LineChartProps) {
  const colorMap = {
    blue: { stroke: '#3b82f6', fill: '#eff6ff' },
    green: { stroke: '#10b981', fill: '#ecfdf5' },
    red: { stroke: '#ef4444', fill: '#fef2f2' },
    yellow: { stroke: '#eab308', fill: '#fefce8' },
    cyan: { stroke: '#06b6d4', fill: '#ecf9fd' },
  };

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 40;
  const chartWidth = 600;
  const chartHeight = 200;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1 || 1)) * (chartWidth - padding * 2) + padding;
    const y = chartHeight - ((value - min) / range) * (chartHeight - padding) - padding / 2;
    return { x, y, value };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ');

  const fillPath = `${pathData} L ${points[points.length - 1].x} ${chartHeight - padding / 2} L ${padding} ${
    chartHeight - padding / 2
  } Z`;

  const colors = colorMap[color];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>

      <div className="overflow-x-auto">
        <svg width="100%" height="280" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={colors.stroke} stopOpacity="0.2" />
              <stop offset="100%" stopColor={colors.stroke} stopOpacity="0" />
            </linearGradient>
          </defs>

          <path d={fillPath} fill={`url(#gradient-${color})`} />

          <path d={pathData} stroke={colors.stroke} strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />

          {points.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill={colors.stroke}
              stroke="white"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          <text x="10" y="30" fontSize="12" fill="#666" textAnchor="start">
            {max.toFixed(0)}
          </text>
          <line x1="30" y1="20" x2={chartWidth - 10} y2="20" stroke="#e5e7eb" strokeWidth="1" />

          <text x="10" y={chartHeight - 10} fontSize="12" fill="#666" textAnchor="start">
            {min.toFixed(0)}
          </text>
          <line x1="30" y1={chartHeight - 20} x2={chartWidth - 10} y2={chartHeight - 20} stroke="#e5e7eb" strokeWidth="1" />
        </svg>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-2">
          {labels.length > 0 && (
            <>
              <span className="text-xs text-gray-600">
                {labels[0]} - {labels[labels.length - 1]}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center space-x-4 text-xs text-gray-600">
          <span>Min: {min.toFixed(2)}</span>
          <span>Max: {max.toFixed(2)}</span>
          <span>Avg: {(data.reduce((a, b) => a + b, 0) / data.length).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
