/**
 * ContractAnalysis — Risk score, key risks, and market comparison display.
 * Refined typography matching the minimal homepage style.
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
    <div className="space-y-5 animate-fade-in">
      {/* Section title */}
      <h2 className="font-display font-bold text-[1.1rem] text-slate-800 tracking-tight">
        Contract Analysis
      </h2>

      {/* Risk Score Gauge */}
      <div className="card p-6 flex flex-col items-center">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-4">
          Overall Risk Score
        </p>
        <RiskGauge score={result.risk_score} />
      </div>

      {/* Market Comparison */}
      {result.market_comparison?.commodity && (
        <div className="card p-5">
          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-4">
            Market Comparison
          </h3>
          <div className="space-y-0">
            {[
              { label: 'Commodity', value: result.market_comparison.commodity, suffix: result.market_comparison.unit ? `(${result.market_comparison.unit})` : '' },
              { label: 'Market Price (Avg.)', value: result.market_comparison.market_price, bold: true },
              { label: 'Offered Price', value: result.market_comparison.offered_price, bold: true },
              { label: 'Difference', value: result.market_comparison.difference, color: true },
            ].map((row, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                <span className="text-[13px] text-slate-500">{row.label}</span>
                <span className={`text-[13px] ${
                  row.color
                    ? (result.market_comparison.difference?.startsWith('-') ? 'text-red-600 font-bold' : 'text-robin-600 font-bold')
                    : row.bold ? 'font-semibold text-slate-800' : 'text-slate-700'
                }`}>
                  {row.value}
                  {row.suffix && <span className="text-slate-400 text-[11px] ml-1">{row.suffix}</span>}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Risks */}
      {result.risks?.length > 0 && (
        <div className="card p-5">
          <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] mb-4">
            Flagged Risks
          </h3>
          <div className="space-y-2.5">
            {result.risks.map((risk, index) => (
              <div
                key={index}
                className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${
                        risk.severity === 'high' ? 'bg-red-500' : risk.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                      <span className="text-[13px] font-semibold text-slate-800 leading-tight">{risk.title}</span>
                    </div>
                    <p className="text-[12px] text-slate-500 leading-relaxed ml-4">{risk.description}</p>
                    {risk.clause_ref && (
                      <p className="text-[11px] text-slate-400 mt-1 ml-4">{risk.clause_ref}</p>
                    )}
                  </div>
                  <span className={`${severityBadge(risk.severity)} flex-shrink-0 text-[10px]`}>
                    {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {result.summary && (
        <div className="p-4 bg-robin-50/50 border border-robin-200/60 rounded-xl">
          <p className="text-[11px] font-semibold text-robin-600 uppercase tracking-[0.15em] mb-2">Summary</p>
          <p className="text-[13px] text-slate-700 leading-relaxed">{result.summary}</p>
        </div>
      )}
    </div>
  );
}
