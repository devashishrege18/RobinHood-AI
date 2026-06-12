/**
 * ProcessingSteps — Animated step-by-step analysis indicator.
 */

import { useState, useEffect } from 'react';

const STEPS = [
  { id: 'extract', label: 'Extracting Text (OCR)', sub: 'Contract scanned successfully' },
  { id: 'understand', label: 'Understanding Language', sub: 'Converting to simple terms' },
  { id: 'market', label: 'Fetching Market Data', sub: 'Live prices from trusted sources' },
  { id: 'risks', label: 'Analyzing Risks', sub: 'Checking unfair clauses' },
  { id: 'strategy', label: 'Generating Strategy', sub: 'Preparing best negotiation plan' },
];

export default function ProcessingSteps({ active = true, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!active) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= STEPS.length) {
          clearInterval(timer);
          setTimeout(() => onComplete?.(), 600);
          return STEPS.length - 1;
        }
        return next;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [active, onComplete]);

  return (
    <div className="max-w-sm mx-auto py-8">
      <h2 className="text-lg font-display font-semibold text-slate-800 text-center mb-2">
        Analyzing Contract...
      </h2>
      <p className="text-sm text-slate-500 text-center mb-8">
        Please wait while we review your document
      </p>

      <div className="space-y-4">
        {STEPS.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div
              key={step.id}
              className={`flex items-start space-x-3 transition-opacity duration-300
                ${isPending ? 'opacity-30' : 'opacity-100'}
                ${isCurrent || isDone ? 'animate-step-in' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Status indicator */}
              <div className="flex-shrink-0 mt-0.5">
                {isDone ? (
                  <div className="w-6 h-6 rounded-full bg-robin-500 flex items-center justify-center">
                    <CheckIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-6 h-6 rounded-full border-2 border-robin-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-robin-500 animate-pulse" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-200" />
                )}
              </div>

              {/* Text */}
              <div>
                <p className={`text-sm font-medium ${isDone || isCurrent ? 'text-slate-800' : 'text-slate-400'}`}>
                  {step.label}
                </p>
                {(isDone || isCurrent) && (
                  <p className="text-xs text-slate-500 mt-0.5">{step.sub}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function CheckIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
