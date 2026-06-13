/**
 * RiskGauge — SVG semi-circular gauge for risk score display.
 */

export default function RiskGauge({ score = 50, size = 180 }) {
  const radius = 70;
  const circumference = Math.PI * radius; // Semi-circle
  const fillPercent = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - fillPercent);

  const getColor = (s) => {
    if (s >= 70) return { stroke: '#ef4444', text: 'text-red-600', label: 'High Risk', bg: 'bg-red-50' };
    if (s >= 40) return { stroke: '#f59e0b', text: 'text-amber-600', label: 'Medium Risk', bg: 'bg-amber-50' };
    return { stroke: '#2D6A4F', text: 'text-robin-500', label: 'Low Risk', bg: 'bg-green-50' };
  };

  const color = getColor(score);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size * 0.6} viewBox="0 0 200 120" className="overflow-visible">
        {/* Background arc */}
        <path
          d="M 20 100 A 70 70 0 0 1 180 100"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Filled arc */}
        <path
          d="M 20 100 A 70 70 0 0 1 180 100"
          fill="none"
          stroke={color.stroke}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        {/* Score text — right-aligned before center */}
        <text x="96" y="88" textAnchor="end" className="font-display" fill="#1e293b" fontSize="38" fontWeight="800">
          {score}
        </text>
        {/* /100 — left-aligned after center */}
        <text x="100" y="88" textAnchor="start" fill="#94a3b8" fontSize="13" fontWeight="500">
          /100
        </text>
      </svg>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold -mt-1 ${color.bg} ${color.text}`}>
        {color.label}
      </span>
    </div>
  );
}
