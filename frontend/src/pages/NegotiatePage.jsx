/**
 * NegotiatePage — 4-step contract analysis flow with refined typography.
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import VoiceMic from '../components/VoiceMic';
import FileUpload from '../components/FileUpload';
import ProcessingSteps from '../components/ProcessingSteps';
import ContractAnalysis from '../components/ContractAnalysis';
import NegotiationStrategy from '../components/NegotiationStrategy';
import useAnalysis from '../hooks/useAnalysis';

const STEP_LABELS = ['Input', 'Processing', 'Risk Analysis', 'Strategy'];

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

  // If navigated from homepage with state, auto-start
  useEffect(() => {
    if (location.state?.voiceText || location.state?.file) {
      const text = location.state.voiceText || '';
      const f = location.state.file || null;
      setVoiceText(text);
      if (f) setFile(f);
      const timer = setTimeout(() => startAnalysis(text, f), 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => startAnalysis(voiceText, file);

  // Auto-submit from voice mic
  const handleAutoSubmit = (text) => startAnalysis(text, file);

  // Map steps to progress bar
  const progressStep = step === 3 ? 4 : step === 2 ? 2 : 1;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] relative overflow-hidden bg-white">

      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-robin-50/40 rounded-full blur-3xl" />
      </div>

      <div className="section-container py-8">

        {/* ── Progress bar ── */}
        <div className="flex items-center justify-center mb-10">
          {STEP_LABELS.map((label, i) => {
            const stepNum = i + 1;
            const isActive = progressStep >= stepNum;
            const isCurrent = progressStep === stepNum;
            return (
              <div key={label} className="flex items-center">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-300
                      ${isActive
                        ? 'bg-robin-500 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                      }
                      ${isCurrent ? 'ring-2 ring-robin-200 ring-offset-1' : ''}`}
                  >
                    {isActive && stepNum < progressStep ? (
                      <CheckSmall />
                    ) : stepNum}
                  </div>
                  <span className={`text-[12px] font-medium hidden sm:inline tracking-tight ${isActive ? 'text-slate-700' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {i < 3 && (
                  <div className={`w-8 sm:w-12 h-px mx-2 transition-colors duration-300 ${progressStep > stepNum ? 'bg-robin-400' : 'bg-slate-200'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ── Step 1: Input ── */}
        {step === 1 && (
          <div className="max-w-lg mx-auto animate-fade-in">

            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="font-display font-black text-[1.8rem] sm:text-[2.1rem] text-slate-900 tracking-tight leading-tight mb-2">
                Ask Robin-Hood AI
              </h1>
              <p className="text-slate-500 text-[14px]">
                Speak about your deal or upload a contract
              </p>
            </div>

            {/* Voice mic — auto-submits when done */}
            <div className="mb-6">
              <VoiceMic
                onTranscript={setVoiceText}
                autoSubmit={true}
                onAutoSubmit={handleAutoSubmit}
              />
            </div>

            {/* Type manually */}
            <div className="mb-4">
              <textarea
                id="manual-input"
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                onInput={(e) => setVoiceText(e.target.value)}
                placeholder="Or type your query here... e.g. 'I received a wheat contract for Rs 2,350 per quintal. Is this fair?'"
                rows={3}
                className="textarea-field text-sm"
              />
            </div>

            {/* Separator */}
            <div className="flex items-center my-6 max-w-xs mx-auto">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.18em]">
                or upload
              </span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* File upload */}
            <FileUpload onFileSelect={setFile} />

            {/* Error */}
            {error && (
              <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="mt-10 text-center">
              <button
                onClick={handleSubmit}
                disabled={loading || (!voiceText.trim() && !file)}
                className="btn-primary px-14 py-3.5 text-[14px] font-semibold tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
                id="submit-analysis-button"
              >
                Analyze
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Processing ── */}
        {step === 2 && (
          <div className="max-w-md mx-auto animate-fade-in">
            <ProcessingSteps
              active={true}
              onComplete={() => {
                if (!loading && result) showResults();
              }}
            />
            {!loading && result && (
              <div className="text-center mt-6">
                <button onClick={showResults} className="text-sm text-robin-600 font-semibold hover:underline tracking-tight">
                  Skip to results
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: Results ── */}
        {step === 3 && result && (
          <div className="animate-fade-in">

            {/* Results header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display font-black text-[1.5rem] sm:text-[1.8rem] text-slate-900 tracking-tight">
                  Analysis Complete
                </h2>
                <p className="text-slate-500 text-[13px] mt-0.5">
                  Review your contract insights and negotiation strategy
                </p>
              </div>
              <button onClick={reset} className="btn-secondary text-[13px] px-5 py-2.5">
                New Analysis
              </button>
            </div>

            {/* Two-column results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ContractAnalysis result={result} />
              <NegotiationStrategy result={result} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}


function CheckSmall() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
