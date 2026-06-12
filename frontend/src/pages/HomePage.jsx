/**
 * HomePage — Voice-first. Clean typography, generous spacing, floating avatar.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VoiceMic from '../components/VoiceMic';
import FileUpload from '../components/FileUpload';

export default function HomePage() {
  const navigate = useNavigate();
  const [voiceText, setVoiceText] = useState('');
  const [file, setFile] = useState(null);

  const handleFileSelect = (fileData) => setFile(fileData);
  const handleTranscript = (text) => setVoiceText(text);
  const handleAnalyze = () => navigate('/negotiate', { state: { voiceText, file } });

  const hasInput = voiceText.trim() || file;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] relative overflow-hidden bg-white">

      {/* Subtle radial background tint */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-robin-50/60 rounded-full blur-3xl" />
      </div>

      {/* Main column */}
      <div className="flex flex-col items-center min-h-[calc(100vh-3.5rem)] px-6">

        {/* ── Avatar ── */}
        <div className="mt-12 mb-5 animate-float">
          <img
            src="/logo.png"
            alt="Robin-Hood AI"
            className="w-28 h-28 sm:w-36 sm:h-36 object-contain select-none"
          />
        </div>

        {/* ── Brand name ── */}
        <h1 className="font-display font-black text-[2.75rem] sm:text-[3.25rem] tracking-tight text-slate-900 leading-none text-center">
          Robin-Hood AI
        </h1>

        {/* ── Tagline ── */}
        <p className="mt-3 font-display font-semibold text-robin-600 text-[1.05rem] tracking-wide text-center">
          Leveling the Playing Field
        </p>

        {/* ── Sub-description ── */}
        <div className="mt-5 mb-12 text-center space-y-1">
          <p className="text-slate-500 text-[15px] font-normal leading-relaxed">
            Your AI Negotiation Partner
          </p>
          <p className="text-slate-400 text-[13px] tracking-[0.08em] uppercase font-medium">
            Speak &nbsp;&middot;&nbsp; Understand &nbsp;&middot;&nbsp; Negotiate &nbsp;&middot;&nbsp; Win
          </p>
        </div>

        {/* ── Mic ── */}
        <VoiceMic onTranscript={handleTranscript} />

        {/* ── Divider ── */}
        <div className="flex items-center w-full max-w-[220px] my-7">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.18em]">
            or
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* ── Upload ── */}
        <FileUpload onFileSelect={handleFileSelect} />

        {/* ── Analyze CTA ── */}
        {hasInput && (
          <div className="mt-10 animate-slide-up">
            <button
              onClick={handleAnalyze}
              className="btn-primary px-12 py-3.5 text-[14px] font-semibold tracking-wide"
              id="analyze-button"
            >
              Analyze Contract
            </button>
          </div>
        )}

        {/* ── Bottom tagline ── */}
        <div className="mt-auto py-8">
          <p className="text-[11px] text-slate-400 tracking-[0.12em] uppercase text-center font-medium">
            Voice-first &nbsp;&middot;&nbsp; Local Language &nbsp;&middot;&nbsp; Built for Bharat
          </p>
        </div>

      </div>
    </div>
  );
}
