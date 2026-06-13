/**
 * useAnalysis — Manages the 4-step contract analysis flow.
 *
 * Steps: 1=input, 2=processing, 3=results
 * Includes auto-retry once on failure (handles Render cold-start timeouts).
 */

import { useState, useCallback } from 'react';
import { analyzeContract } from '../services/api';

export function useAnalysis() {
  const [step, setStep] = useState(1);
  const [voiceText, setVoiceText] = useState('');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const startAnalysis = useCallback(async (text, uploadedFile) => {
    const inputText = text || voiceText;
    const inputFile = uploadedFile || file;

    if (!inputText.trim() && !inputFile) {
      setError('Please speak or upload a document to analyze.');
      return;
    }

    setError(null);
    setRetrying(false);
    setStep(2);
    setLoading(true);

    const payload = {
      text: inputText,
      fileBase64: inputFile?.base64 || '',
      fileName: inputFile?.name || '',
    };

    const attempt = async () => {
      const response = await analyzeContract(payload);
      return response;
    };

    try {
      const response = await attempt();
      setResult(response);
    } catch (firstErr) {
      // First failure — likely Render cold start. Auto-retry once.
      setRetrying(true);
      try {
        // Wait 4s for the backend to finish waking up, then retry
        await new Promise((r) => setTimeout(r, 4000));
        const response = await attempt();
        setResult(response);
        setRetrying(false);
      } catch (retryErr) {
        setRetrying(false);
        const isTimeout =
          retryErr.code === 'ECONNABORTED' ||
          retryErr.message?.toLowerCase().includes('timeout') ||
          retryErr.message?.toLowerCase().includes('network');

        const msg = isTimeout
          ? 'The backend server is waking up (Render free tier). Please click Analyze again in 30 seconds.'
          : retryErr.response?.data?.detail ||
            retryErr.message ||
            'Analysis failed. Please try again.';

        setError(msg);
        setStep(1);
      }
    } finally {
      setLoading(false);
    }
  }, [voiceText, file]);

  const showResults = useCallback(() => {
    if (result) setStep(3);
  }, [result]);

  const reset = useCallback(() => {
    setStep(1);
    setVoiceText('');
    setFile(null);
    setResult(null);
    setError(null);
    setLoading(false);
    setRetrying(false);
  }, []);

  return {
    step,
    voiceText,
    file,
    result,
    loading,
    error,
    retrying,
    setVoiceText,
    setFile,
    startAnalysis,
    showResults,
    reset,
  };
}

export default useAnalysis;
