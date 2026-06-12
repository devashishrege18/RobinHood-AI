/**
 * ContractAnalysis — Risk score, key risks, and market comparison display.
 */

import RiskGauge from './RiskGauge';

export default function ContractAnalysis({ result }) {
  if (!result) return null;

  const severityBadge = (severity) => {
    const map = {
      high: 'badge-high',
      medium: 'badge-medium',
      low: 'badge-low',
    };
    return map[severity] || 'badge-low';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-slate-800">
          Contract Analysis
        </h2>
      </div>

      {/* Risk Score Gauge */}
      <div className="card p-6 flex flex-col items-center">
        <p className="text-sm font-medium text-slate-500 mb-3">Overall Risk Score</p>
        <RiskGauge score={result.risk_score} />
      </div>

      {/* Key Risks */}
      {result.risks?.length > 0 && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Key Risks Found
          </h3>
          <div className="space-y-3">
            {result.risks.map((risk, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 bg-slate-50 rounded-xl"
              >
                <div className="flex-1 pr-3">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`dot-${risk.severity}`} />
                    <span className="text-sm font-semibold text-slate-800">{risk.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{risk.description}</p>
                  {risk.clause_ref && (
                    <p className="text-xs text-slate-400 mt-1">({risk.clause_ref})</p>
                  )}
                </div>
                <span className={severityBadge(risk.severity)}>
                  {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Risk
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Market Comparison */}
      {result.market_comparison?.commodity && (
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">
            Market Comparison
          </h3>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 text-slate-500">Commodity</td>
                <td className="py-2 text-right font-medium text-slate-800">
                  {result.market_comparison.commodity}
                  {result.market_comparison.unit && (
                    <span className="text-xs text-slate-400 ml-1">
                      ({result.market_comparison.unit})
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-500">Market Price (Avg.)</td>
                <td className="py-2 text-right font-semibold text-slate-800">
                  {result.market_comparison.market_price}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-500">Offered Price in Contract</td>
                <td className="py-2 text-right font-semibold text-slate-800">
                  {result.market_comparison.offered_price}
                </td>
              </tr>
              <tr>
                <td className="py-2 text-slate-500">Difference</td>
                <td className={`py-2 text-right font-semibold ${
                  result.market_comparison.difference?.startsWith('-')
                    ? 'text-red-600' : 'text-robin-600'
                }`}>
                  {result.market_comparison.difference}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      {result.summary && (
        <div className="p-4 bg-robin-50 border border-robin-200 rounded-xl">
          <p className="text-sm text-robin-800 leading-relaxed">{result.summary}</p>
        </div>
      )}
    </div>
  );
}
