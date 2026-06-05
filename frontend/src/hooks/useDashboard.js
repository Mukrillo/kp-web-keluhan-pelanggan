import { useState, useEffect, useCallback, useRef } from 'react';
import { adminService } from '../services/admin.service';
import toast from 'react-hot-toast';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [latestTickets, setLatestTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchDashboard = useCallback(async (isRefresh = false) => {
    // Cancel previous in-flight request
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    if (isRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.getDashboard({
        signal: abortRef.current.signal,
      });
      setStats(data.stats);
      setLatestTickets(data.latestTickets || []);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      const msg = err.message || 'Gagal memuat data dashboard.';
      setError(msg);
      if (isRefresh) toast.error('Gagal refresh dashboard.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    return () => abortRef.current?.abort();
  }, [fetchDashboard]);

  return {
    stats,
    latestTickets,
    isLoading,
    isRefreshing,
    error,
    refresh: () => fetchDashboard(true),
  };
};
