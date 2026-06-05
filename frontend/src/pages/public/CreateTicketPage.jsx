import { useState } from 'react';
import { CheckCircle2, Copy, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import TicketForm from '../../components/public/TicketForm';

const CreateTicketPage = () => {
  const [success, setSuccess] = useState(null);
  const [copied, setCopied]   = useState(false);

  const handleCopy = () => {
    if (!success?.ticketNumber) return;
    navigator.clipboard.writeText(success.ticketNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 text-center animate-fade-in-up shadow-lg">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Tiket Berhasil Dibuat!</h2>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Konfirmasi telah dikirim ke email Anda. Simpan nomor tiket berikut untuk melacak progress keluhan Anda.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Nomor Tiket Anda</p>
            <p className="text-blue-700 font-mono font-extrabold text-3xl tracking-widest">{success.ticketNumber}</p>
          </div>

          <button
            onClick={handleCopy}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold mb-3 transition-all duration-200 border
              ${copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 shadow-sm'
              }`}
          >
            {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Tersalin!' : 'Salin Nomor Tiket'}
          </button>

          <Link
            to={`/track?ticket=${success.ticketNumber}`}
            className="w-full flex items-center justify-center gap-2 py-3 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-colors mb-4 shadow-md shadow-blue-500/20"
          >
            <Search className="w-4 h-4" />
            Lacak Tiket Sekarang
          </Link>

          <button
            onClick={() => setSuccess(null)}
            className="text-slate-400 hover:text-slate-600 text-sm transition-colors"
          >
            Buat tiket baru
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Buat Tiket Keluhan</h1>
        <p className="text-slate-500 text-sm">Isi formulir berikut untuk melaporkan keluhan Anda kepada tim kami.</p>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <TicketForm onSuccess={setSuccess} />
      </div>
    </div>
  );
};

export default CreateTicketPage;
