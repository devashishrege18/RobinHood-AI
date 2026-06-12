/**
 * API service — HTTP client for the FastAPI backend.
 */

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000, // 90s for Gemini analysis
});

/**
 * Analyze a contract or deal via voice/text and optional file.
 */
export async function analyzeContract({ text, fileBase64, fileName, language }) {
  const response = await api.post('/api/analyze', {
    text: text || '',
    file_content: fileBase64 || '',
    file_name: fileName || '',
    language: language || 'en',
  });
  return response.data;
}

/**
 * Health check.
 */
export async function healthCheck() {
  const response = await api.get('/api/health');
  return response.data;
}

export default api;
