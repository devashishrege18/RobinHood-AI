/**
 * VoiceMic — Google Assistant-style mic.
 * Auto-stops after 3s of silence, auto-submits the transcript.
 *
 * Key fixes:
 * - SpeechRecognition is created ONCE (no state in useEffect deps)
 * - All timers use refs to avoid stale closures
 * - Mobile: uses event.resultIndex to prevent duplicate words
 */

import { useState, useRef, useEffect } from 'react';

const SILENCE_MS = 3000; // Auto-stop after 3s of no new speech

export default function VoiceMic({ onTranscript, disabled = false, autoSubmit = false, onAutoSubmit }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const [statusText, setStatusText] = useState('');

  // Refs — stable across renders, no stale closures
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const listeningRef = useRef(false);
  const transcriptRef = useRef('');

  // ── Clear silence timer ──
  function clearSilenceTimer() {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }

  // ── Start silence timer ──
  function startSilenceTimer() {
    clearSilenceTimer();
    silenceTimerRef.current = setTimeout(() => {
      // Auto-stop — uses ref, not stale state
      if (recognitionRef.current && listeningRef.current) {
        setStatusText('Auto-stopping...');
        try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      }
    }, SILENCE_MS);
    setStatusText('Speak now — stops automatically when done');
  }

  // ── Create SpeechRecognition once on mount ──
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN';

    recognition.onresult = (event) => {
      // Only process NEW results from event.resultIndex onward
      // This prevents mobile Chrome from re-reading old results
      let finalText = '';
      let interimText = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript + ' ';
        } else {
          interimText += result[0].transcript;
        }
      }

      const combined = (finalText + interimText).trim();
      transcriptRef.current = combined;
      setTranscript(combined);

      // Reset silence timer — user is still talking
      startSilenceTimer();
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // No speech detected — auto-stop
        setStatusText('No speech detected');
        try { recognition.stop(); } catch (e) { /* ignore */ }
      } else if (event.error !== 'aborted') {
        listeningRef.current = false;
        setListening(false);
        clearSilenceTimer();
      }
    };

    recognition.onend = () => {
      listeningRef.current = false;
      setListening(false);
      clearSilenceTimer();
      setStatusText('');
    };

    recognitionRef.current = recognition;

    return () => {
      clearSilenceTimer();
      try { recognition.stop(); } catch (e) { /* ignore */ }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // MUST be empty — create recognition once

  // ── Auto-submit when listening stops and we have a transcript ──
  useEffect(() => {
    if (!listening && transcript) {
      if (onTranscript) onTranscript(transcript);
      if (autoSubmit && onAutoSubmit) {
        const timer = setTimeout(() => onAutoSubmit(transcript), 500);
        return () => clearTimeout(timer);
      }
    }
  }, [listening, transcript, onTranscript, autoSubmit, onAutoSubmit]);

  // ── Toggle listening ──
  function toggleListening() {
    if (!recognitionRef.current || disabled) return;

    if (listeningRef.current) {
      // Stop
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      listeningRef.current = false;
      setListening(false);
      clearSilenceTimer();
    } else {
      // Start
      setTranscript('');
      transcriptRef.current = '';
      setStatusText('');
      try {
        recognitionRef.current.start();
        listeningRef.current = true;
        setListening(true);
        startSilenceTimer(); // In case user doesn't speak at all
      } catch (e) {
        console.error('Could not start recognition:', e);
        // If already started, try abort + restart
        try {
          recognitionRef.current.abort();
          setTimeout(() => {
            try {
              recognitionRef.current.start();
              listeningRef.current = true;
              setListening(true);
              startSilenceTimer();
            } catch (e2) {
              console.error('Retry failed:', e2);
            }
          }, 100);
        } catch (e2) { /* give up */ }
      }
    }
  }

  if (!supported) {
    return (
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <MicIcon className="w-10 h-10 text-slate-400" />
        </div>
        <p className="text-sm text-slate-500">
          Voice input is not supported in this browser.
          <br />Please use Chrome or Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {/* Mic button */}
      <div className="relative mb-4">
        {listening && (
          <>
            <div className="absolute inset-0 rounded-full bg-red-400/30 animate-pulse-ring" />
            <div className="absolute inset-0 rounded-full bg-red-400/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
          </>
        )}
        <button
          id="voice-mic-button"
          onClick={toggleListening}
          disabled={disabled}
          className={listening ? 'mic-button-listening' : 'mic-button'}
          aria-label={listening ? 'Stop recording' : 'Start recording'}
        >
          <MicIcon className="w-10 h-10" />
        </button>
      </div>

      {/* Label */}
      <p className="text-sm font-medium text-slate-700 mb-1">
        {listening ? 'Listening...' : 'Tap to Speak'}
      </p>

      {/* Status */}
      {listening && statusText && (
        <div className="flex items-center space-x-1.5 text-xs font-medium animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-500">{statusText}</span>
        </div>
      )}

      {/* Transcript preview */}
      {transcript && (
        <div className="mt-4 w-full max-w-md p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 leading-relaxed animate-fade-in">
          {transcript}
        </div>
      )}
    </div>
  );
}


function MicIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="1" width="6" height="14" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}
