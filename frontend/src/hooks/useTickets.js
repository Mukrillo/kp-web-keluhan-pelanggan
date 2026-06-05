import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { adminService } from '../services/admin.service';
import toast from 'react-hot-toast';

export const useTickets = ({ isArchiveView = false } = {}) => {
  const [tickets, setTickets] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const abortRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Derive params from URL (URL Driven State)
  const params = {
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: parseInt(searchParams.get('limit') || '10', 10),
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    archived: String(isArchiveView),
  };

  const fetchTickets = useCallback(
    async (isRefresh = false) => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      if (isRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      try {
        const queryParams = {
          page: parseInt(searchParams.get('page') || '1', 10),
          limit: parseInt(searchParams.get('limit') || '10', 10),
          search: searchParams.get('search') || '',
          status: searchParams.get('status') || '',
          sortBy: searchParams.get('sortBy') || 'createdAt',
          sortOrder: searchParams.get('sortOrder') || 'desc',
          archived: String(isArchiveView),
        };

        const res = await adminService.getTickets(queryParams, {
          signal: abortRef.current.signal,
        });
        setTickets(res.data || []);
        setPagination(res.pagination || null);
        setSelectedIds(new Set());
      } catch (err) {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        const msg = err.message || 'Gagal memuat daftar tiket.';
        setError(msg);
        if (isRefresh) toast.error('Gagal refresh daftar tiket.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    // Re-run whenever URL search params change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams, isArchiveView]
  );

  useEffect(() => {
    fetchTickets();
    return () => abortRef.current?.abort();
  }, [fetchTickets]);

  // ── URL-Driven Filter Setters ────────────────────────────────────────────────
  const setFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, String(value));
        else next.delete(key);
        // Reset to page 1 on filter change
        if (key !== 'page') next.set('page', '1');
        return next;
      });
    },
    [setSearchParams]
  );

  const setPage = useCallback(
    (page) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set('page', String(page));
        return next;
      });
    },
    [setSearchParams]
  );

  // ── Row Selection ────────────────────────────────────────────────────────────
  const toggleSelect = useCallback((id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) =>
      prev.size === tickets.length ? new Set() : new Set(tickets.map((t) => t._id))
    );
  }, [tickets]);

  // ── Quick Status Update (Set-based Lock) ─────────────────────────────────────
  const quickUpdateStatus = useCallback(
    async (ticketId, newStatus) => {
      if (updatingIds.has(ticketId)) return; // prevent double-fire

      setUpdatingIds((prev) => new Set(prev).add(ticketId));
      try {
        await adminService.updateTicket(ticketId, { status: newStatus });
        setTickets((prev) =>
          prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t))
        );
        toast.success('Status berhasil diperbarui.');
      } catch (err) {
        toast.error(err.message || 'Gagal memperbarui status.');
      } finally {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(ticketId);
          return next;
        });
      }
    },
    [updatingIds]
  );

  // ── Bulk Archive (Optimistic Removal + Rollback) ─────────────────────────────
  const bulkArchive = useCallback(
    async (ids) => {
      const snapshot = structuredClone(tickets); // deep copy for rollback
      const idsArray = Array.from(ids);

      // Optimistic: remove rows immediately
      setTickets((prev) => prev.filter((t) => !ids.has(t._id)));
      setSelectedIds(new Set());

      try {
        await adminService.bulkArchive(idsArray);
        toast.success(`${idsArray.length} tiket berhasil diarsipkan.`);
        fetchTickets(true);
      } catch (err) {
        // Rollback on failure
        setTickets(snapshot);
        toast.error(err.message || 'Bulk archive gagal. Data dikembalikan.');
      }
    },
    [tickets, fetchTickets]
  );

  // ── Bulk Restore (Optimistic Removal + Rollback) ─────────────────────────────
  const bulkRestore = useCallback(
    async (ids) => {
      const snapshot = structuredClone(tickets);
      const idsArray = Array.from(ids);

      setTickets((prev) => prev.filter((t) => !ids.has(t._id)));
      setSelectedIds(new Set());

      try {
        await adminService.bulkRestore(idsArray);
        toast.success(`${idsArray.length} tiket berhasil dipulihkan.`);
        fetchTickets(true);
      } catch (err) {
        setTickets(snapshot);
        toast.error(err.message || 'Bulk restore gagal. Data dikembalikan.');
      }
    },
    [tickets, fetchTickets]
  );

  return {
    tickets,
    pagination,
    isLoading,
    isRefreshing,
    error,
    selectedIds,
    updatingIds,
    params,
    setFilter,
    setPage,
    toggleSelect,
    toggleSelectAll,
    quickUpdateStatus,
    bulkArchive,
    bulkRestore,
    refresh: () => fetchTickets(true),
  };
};
