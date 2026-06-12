/**
 * NegotiatePage — 4-step contract analysis flow.
 *
 * Step 1: Voice/text input + file upload
 * Step 2: Processing animation
 * Step 3: Risk & Insights + Negotiation Strategy (side by side on desktop)
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VoiceMic from '../components/VoiceMic';
import FileUpload from '../components/FileUpload';
import ProcessingSteps from '../components/ProcessingSteps';
import ContractAnalysis from '../components/ContractAnalysis';
import NegotiationStrategy from '../components/NegotiationStrategy';
import useAnalysis from '../hooks/useAnalysis';

const STEP_LABELS = ['Voice / Image Input', 'AI Processing', 'Risk & Insights', 'Negotiation Strategy'];

export default function NegotiatePage() {
  const location = useLocation();
  const {
    step,
    voiceText,
    file,
    result,
    loading,
    error,
    setVoiceText,
    setFile,
    startAnalysis,
    showResults,
    reset,
  } = useAnalysis();

  // If navigated from homepage with state, auto-start analysis
  useEffect(() => {
    if (location.state?.voiceText || location.state?.file) {
      const text = location.state.voiceText || '';
      const f = location.state.file || null;
      setVoiceText(text);
      if (f) setFile(f);

      // Small delay so state settles
      const timer = setTimeout(() => {
        startAnalysis(text, f);
      }, 300);
      return () => clearTimeout(timer);
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    startAnalysis(voiceText, file);
  };

  // Map internal steps to the 4 wireframe steps
  const progressStep = step === 3 ? 4 : step === 2 ? 2 : 1;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-8">
      <div className="section-container">

        {/* Progress bar */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = progressStep >= stepNum;
            const isCurrent = progressStep === stepNum;
            return (
              <div key={label} className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200
                      ${isActive
                        ? 'bg-robin-500 text-white'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }
                      ${isCurrent ? 'ring-2 ring-robin-200' : ''}`}
                  >
                    {stepNum}
                  </div>
                  <span className={`text-xs font-medium hidden sm:inline ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <div className="flex items-center">
                    <ArrowIcon className={`w-3.5 h-3.5 ${progressStep > stepNum ? 'text-robin-500' : 'text-slate-300'}`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ─── Step 1: Input ─── */}
        {step === 1 && (
          <div className="max-w-md mx-auto animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="font-display font-semibold text-xl text-slate-800 mb-1">
                Ask Robin-Hood AI
              </h1>
              <p className="text-sm text-slate-500">
                Speak about your deal or upload a contract
              </p>
            </div>

            {/* Voice mic */}
            <div className="mb-6">
              <VoiceMic onTranscript={setVoiceText} />
            </div>

            {/* Or type manually */}
            {!voiceText && (
              <div className="mb-4">
                <textarea
                  id="manual-input"
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  placeholder="Or type your query here... e.g. 'I received a wheat contract for Rs 2,350 per quintal. Is this fair?'"
                  rows={3}
                  className="textarea-field text-sm"
                />
              </div>
            )}

            {/* Separator */}
            <div className="flex items-center space-x-3 my-5 mx-auto max-w-xs">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">You can also upload the contract</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* File upload */}
            <FileUpload onFileSelect={setFile} />

            {/* Error */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="mt-8 text-center">
              <button
                onClick={handleSubmit}
                disabled={loading || (!voiceText.trim() && !file)}
                className="btn-primary px-10 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                id="submit-analysis-button"
              >
                Analyze
              </button>
            </div>
          </div>
        )}

        {/* ─── Step 2: Processing ─── */}
        {step === 2 && (
          <div className="animate-fade-in">
            <ProcessingSteps
              active={true}
              onComplete={() => {
                if (!loading && result) {
                  showResults();
                }
              }}
            />
            {/* If API finishes before animation, still wait for animation */}
            {!loading && result && (
              <div className="text-center mt-4">
                <button onClick={showResults} className="text-sm text-robin-600 font-medium hover:underline">
                  Skip to results
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── Step 3: Results ─── */}
        {step === 3 && result && (
          <div className="animate-fade-in">
            {/* Back / New analysis */}
            <div className="flex justify-end mb-5">
              <button onClick={reset} className="btn-secondary text-sm px-4 py-2">
                New Analysis
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Risk & Insights */}
              <ContractAnalysis result={result} />

              {/* Right: Negotiation Strategy */}
              <NegotiationStrategy result={result} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


function ArrowIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
