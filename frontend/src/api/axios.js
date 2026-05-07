import axios from 'axios';

/**
 * Resolve the base API URL at runtime so the frontend works correctly in
 * production without needing a rebuild for each deployment.
 *
 * Resolution order:
 *  1. window.__RUNTIME_CONFIG__.apiUrl  – set by the inline script in
 *     index.html, which derives the URL from window.location at page load.
 *     In development the inline script also picks up VITE_API_URL if it was
 *     provided at build time.
 *  2. import.meta.env.VITE_API_URL      – Vite build-time env var (dev only).
 *  3. http://localhost:3000/api/v1      – local development fallback.
 */
function resolveBaseURL() {
  if (
    typeof window !== 'undefined' &&
    window.__RUNTIME_CONFIG__ &&
    window.__RUNTIME_CONFIG__.apiUrl
  ) {
    return window.__RUNTIME_CONFIG__.apiUrl;
  }

  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  return 'http://localhost:3000/api/v1';
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
