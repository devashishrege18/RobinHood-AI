/**
 * useAnalysis — Manages the 4-step contract analysis flow.
 *
 * Steps: 1=input, 2=processing, 3=results
 */

import { useState, useCallback } from 'react';
import { analyzeContract } from '../services/api';

export function useAnalysis() {
  const [step, setStep] = useState(1);        // 1=input, 2=processing, 3=results
  const [voiceText, setVoiceText] = useState('');
  const [file, setFile] = useState(null);      // { name, size, type, base64 }
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Start the analysis — called when user submits voice/file input. */
  const startAnalysis = useCallback(async (text, uploadedFile) => {
    const inputText = text || voiceText;
    const inputFile = uploadedFile || file;

    if (!inputText.trim() && !inputFile) {
      setError('Please speak or upload a document to analyze.');
      return;
    }

    setError(null);
    setStep(2); // Show processing animation
    setLoading(true);

    try {
      const response = await analyzeContract({
        text: inputText,
        fileBase64: inputFile?.base64 || '',
        fileName: inputFile?.name || '',
      });

      setResult(response);
      // Step 3 will be set by ProcessingSteps onComplete callback
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.message ||
        'Analysis failed. Please try again.';
      setError(msg);
      setStep(1); // Go back to input on error
    } finally {
      setLoading(false);
    }
  }, [voiceText, file]);

  /** Move to results view (called after processing animation completes). */
  const showResults = useCallback(() => {
    if (result) {
      setStep(3);
    }
  }, [result]);

  /** Reset everything for a new analysis. */
  const reset = useCallback(() => {
    setStep(1);
    setVoiceText('');
    setFile(null);
    setResult(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
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
  };
}

export default useAnalysis;
