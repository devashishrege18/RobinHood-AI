/**
 * VoiceMic — Google Assistant-style mic.
 * Auto-stops after 3 seconds of silence, auto-submits the transcript.
 */

import { useState, useRef, useCallback, useEffect } from 'react';

const SILENCE_TIMEOUT_MS = 3000; // Stop after 3s of no speech

export default function VoiceMic({ onTranscript, disabled = false, autoSubmit = false, onAutoSubmit }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const [silenceCountdown, setSilenceCountdown] = useState(null); // seconds left
  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const countdownRef = useRef(null);
  const lastResultTimeRef = useRef(null);

  // ── Reset silence timer whenever we get speech ──
  const resetSilenceTimer = useCallback(() => {
    lastResultTimeRef.current = Date.now();
    setSilenceCountdown(null);

    // Clear existing timers
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    // Start countdown to auto-stop
    silenceTimerRef.current = setTimeout(() => {
      // Auto-stop after silence
      if (recognitionRef.current && listening) {
        try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      }
    }, SILENCE_TIMEOUT_MS);

    // Visual countdown — starts at 2s before auto-stop
    const countdownDelay = SILENCE_TIMEOUT_MS - 2000;
    setTimeout(() => {
      let secondsLeft = 2;
      setSilenceCountdown(secondsLeft);
      countdownRef.current = setInterval(() => {
        secondsLeft -= 1;
        if (secondsLeft <= 0) {
          clearInterval(countdownRef.current);
          setSilenceCountdown(null);
        } else {
          setSilenceCountdown(secondsLeft);
        }
      }, 1000);
    }, Math.max(0, countdownDelay));
  }, [listening]);

  // ── Cleanup timers ──
  const clearTimers = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    silenceTimerRef.current = null;
    countdownRef.current = null;
    setSilenceCountdown(null);
  }, []);

  // ── Init speech recognition ──
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
      setTranscript(combined);

      // Reset silence timer — user is still talking
      resetSilenceTimer();
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error !== 'no-speech') {
        setListening(false);
        clearTimers();
      }
    };

    recognition.onend = () => {
      setListening(false);
      clearTimers();
    };

    recognitionRef.current = recognition;

    return () => {
      clearTimers();
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
      }
    };
  }, [resetSilenceTimer, clearTimers]);

  // ── Auto-submit when listening stops and we have transcript ──
  useEffect(() => {
    if (!listening && transcript) {
      // Push transcript to parent
      if (onTranscript) onTranscript(transcript);

      // Auto-submit if enabled (Google Assistant behavior)
      if (autoSubmit && onAutoSubmit) {
        const timer = setTimeout(() => onAutoSubmit(transcript), 400);
        return () => clearTimeout(timer);
      }
    }
  }, [listening, transcript, onTranscript, autoSubmit, onAutoSubmit]);

  // ── Toggle ──
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current || disabled) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      clearTimers();
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
        setListening(true);
        // Start initial silence timer (in case user doesn't speak at all)
        resetSilenceTimer();
      } catch (e) {
        console.error('Could not start recognition:', e);
      }
    }
  }, [listening, disabled, clearTimers, resetSilenceTimer]);

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

      {/* Status with auto-stop countdown */}
      {listening && (
        <div className="flex items-center space-x-1.5 text-xs font-medium animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-red-500">
            {silenceCountdown !== null
              ? `Auto-stopping in ${silenceCountdown}s...`
              : 'Speak now — stops automatically when done'}
          </span>
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
