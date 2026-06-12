/**
 * AboutPage — Project info and how it works. No tech stack.
 */

import { Link } from 'react-router-dom';

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Speak or Upload',
    description: 'Describe your deal in your own language, or upload the contract document directly.',
  },
  {
    step: '02',
    title: 'AI Analyzes',
    description: 'The AI extracts text, understands terms, fetches live market prices, and identifies risks.',
  },
  {
    step: '03',
    title: 'See the Risks',
    description: 'Get a clear risk score, flagged clauses, and a side-by-side market price comparison.',
  },
  {
    step: '04',
    title: 'Get Your Strategy',
    description: 'Receive a counter-offer suggestion and ready-to-use negotiation talking points.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-16">
      <div className="section-container">

        {/* Hero */}
        <div className="max-w-xl mx-auto text-center mb-16">
          <p className="text-[11px] font-semibold text-robin-600 uppercase tracking-[0.2em] mb-4">
            About the Project
          </p>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-tight leading-tight mb-6">
            Leveling the Playing Field
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Robin-Hood AI democratizes negotiation expertise. Small players lose out to
            larger counterparts who have market data, analysts, and professional negotiators.
            We are changing that with AI.
          </p>
        </div>

        {/* How It Works */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="font-display font-bold text-2xl text-slate-800 mb-8 text-center tracking-tight">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="card-hover p-6">
                <div className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-robin-500 flex items-center justify-center text-white font-display font-bold text-[11px] tracking-wide">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="font-semibold text-[15px] text-slate-800 mb-1.5 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-slate-500 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/negotiate" className="btn-primary px-10 py-3 text-[14px]">
            Try It Now
          </Link>
        </div>

      </div>
    </div>
  );
}
