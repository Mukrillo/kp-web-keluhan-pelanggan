import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { ticketService } from '../../services/ticket.service';
import TrackingResult from '../../components/public/TrackingResult';

const TrackTicketPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput]     = useState(searchParams.get('ticket') || '');
  const [ticket, setTicket]   = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]     = useState('');
  const abortRef = useRef(null);

  // Auto-search on URL param
  useEffect(() => {
    const q = searchParams.get('ticket');
    if (q) { setInput(q); handleSearch(q); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (val) => {
    const q = (val ?? input).trim().toUpperCase();
    if (!q) { setError('Masukkan nomor tiket.'); return; }

    if (abortRef.current) abortRef.current.abort();
    abortRef.current = new AbortController();

    setIsLoading(true); setError(''); setTicket(null);

    // Sync URL
    setSearchParams(q ? { ticket: q } : {});

    try {
      const data = await ticketService.trackTicket(q, { signal: abortRef.current.signal });
      setTicket(data.ticket);
    } catch (err) {
      if (err.name === 'CanceledError') return;
      setError(err.status === 404
        ? 'Tiket tidak ditemukan. Periksa kembali nomor tiket Anda.'
        : err.message || 'Gagal melacak tiket. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (e) => { e.preventDefault(); handleSearch(); };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Lacak Tiket</h1>
        <p className="text-slate-500 text-sm">Masukkan nomor tiket Anda untuk melihat status terkini.</p>
      </div>

      <form onSubmit={onSubmit} className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            value={input}
            onChange={(e) => { setInput(e.target.value.toUpperCase()); setError(''); }}
            placeholder="TKT-202406-00001"
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 font-mono tracking-wide transition-colors shadow-sm"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-3 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors flex items-center gap-2 shadow-md shadow-blue-500/20"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Cari
        </button>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {ticket && <TrackingResult ticket={ticket} />}
    </div>
  );
};

export default TrackTicketPage;
