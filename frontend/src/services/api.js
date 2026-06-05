import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Send HttpOnly cookies
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle AbortController cancellation
    if (axios.isCancel(error)) {
      const cancelErr = new Error('Request cancelled');
      cancelErr.name = 'CanceledError';
      return Promise.reject(cancelErr);
    }

    // Handle 401 — dispatch event so AuthContext can update state
    if (error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }

    // Normalize error message
    const message =
      error.response?.data?.message ||
      error.message ||
      'Terjadi kesalahan. Silakan coba lagi.';

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.data = error.response?.data;
    return Promise.reject(normalizedError);
  }
);

export default api;
