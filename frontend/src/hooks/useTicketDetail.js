import { useState, useEffect, useCallback, useRef } from 'react';
import { adminService } from '../services/admin.service';
import toast from 'react-hot-toast';

export const useTicketDetail = (id) => {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const fetchTicket = useCallback(async () => {
    if (!id) return;
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const data = await adminService.getTicketById(id, {
        signal: abortRef.current.signal,
      });
      setTicket(data.ticket);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setError(err.message || 'Gagal memuat detail tiket.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTicket();
    return () => abortRef.current?.abort();
  }, [fetchTicket]);

  const updateTicket = useCallback(
    async (updates) => {
      if (!ticket) return;
      if (ticket.isArchived) {
        toast.error('Tiket yang diarsipkan tidak dapat dimodifikasi.');
        return;
      }
      setIsUpdating(true);
      try {
        const data = await adminService.updateTicket(id, updates);
        setTicket(data.ticket);
        toast.success('Tiket berhasil diperbarui.');
        return data.ticket;
      } catch (err) {
        toast.error(err.message || 'Gagal memperbarui tiket.');
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [id, ticket]
  );

  return {
    ticket,
    isLoading,
    isUpdating,
    error,
    updateTicket,
    refresh: fetchTicket,
  };
};
