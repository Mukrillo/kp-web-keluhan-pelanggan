import { Link } from 'react-router-dom';
import { Ticket, Search, ChevronRight, ShieldCheck, Bell, Clock } from 'lucide-react';

const FEATURES = [
  {
    icon: Ticket,
    title: 'Buat Tiket Mudah',
    desc: 'Ajukan keluhan pengiriman Anda hanya dalam beberapa langkah. Tidak perlu akun, cukup isi form dan kirim.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Search,
    title: 'Lacak Secara Real-time',
    desc: 'Pantau perkembangan tiket keluhan Anda kapan saja menggunakan nomor tiket yang dikirim ke email.',
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    icon: Bell,
    title: 'Notifikasi Email Otomatis',
    desc: 'Dapatkan pemberitahuan langsung ke email setiap kali status tiket Anda diperbarui oleh tim kami.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: Clock,
    title: 'Penanganan Cepat',
    desc: 'Tim kami berkomitmen menangani setiap keluhan dengan prioritas tinggi dan respons yang tepat waktu.',
    color: 'text-red-600 bg-red-50',
  },
];

const STEPS = [
  { no: 1, title: 'Isi Form Keluhan', desc: 'Lengkapi data diri dan deskripsi keluhan pengiriman Anda' },
  { no: 2, title: 'Simpan Nomor Tiket', desc: 'Catat nomor tiket yang dikirim otomatis ke email Anda' },
  { no: 3, title: 'Pantau Progress', desc: 'Lacak tiket dan terima respons dari tim kami melalui platform ini' },
];

const LandingPage = () => (
  <div className="bg-slate-50">
    {/* ── Hero ─────────────────────────────────────────────────────── */}
    <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 text-center py-20">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 max-w-3xl mx-auto leading-tight mb-6 animate-fade-in-up">
        Keluhan Anda Adalah{' '}
        <span className="text-blue-700">Prioritas Kami</span>
      </h1>

      <p className="text-slate-500 text-lg max-w-xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        Platform ticketing resmi Unierman Indah Lestarindo untuk menyampaikan dan melacak
        keluhan pengiriman secara transparan dan efisien.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Link
          to="/buat-tiket"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-700 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 text-sm group"
        >
          Buat Tiket Sekarang
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          to="/track"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-xl transition-all duration-200 text-sm shadow-sm"
        >
          <Search className="w-4 h-4" />
          Lacak Tiket
        </Link>
      </div>
    </section>

    {/* ── Features ─────────────────────────────────────────────────── */}
    <section className="max-w-6xl mx-auto px-4 pb-24">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Fitur Layanan Kami</h2>
        <p className="text-slate-500 max-w-md mx-auto">Kami hadir memudahkan Anda dalam menyampaikan dan memantau keluhan pengiriman secara online.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map(({ icon: Icon, title, desc, color }) => (
          <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group shadow-sm">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-slate-900 font-semibold text-base mb-2">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* ── Steps ────────────────────────────────────────────────────── */}
    <section className="bg-white border-y border-slate-200 py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Cara Kerja</h2>
        <p className="text-slate-500 mb-12">Tiga langkah mudah untuk menyampaikan keluhan Anda.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map(({ no, title, desc }) => (
            <div key={no} className="relative">
              <div className="w-14 h-14 rounded-2xl bg-blue-700 text-white text-xl font-extrabold flex items-center justify-center mx-auto mb-4 shadow-md shadow-blue-500/20">
                {no}
              </div>
              <h3 className="text-slate-900 font-semibold mb-2">{title}</h3>
              <p className="text-slate-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── CTA ──────────────────────────────────────────────────────── */}
    <section className="text-center py-24 px-4 bg-slate-50">
      <h2 className="text-3xl font-bold text-slate-900 mb-4">Siap Menyampaikan Keluhan?</h2>
      <p className="text-slate-500 mb-8 max-w-sm mx-auto">Tim kami siap membantu menyelesaikan masalah pengiriman Anda secepatnya.</p>
      <Link
        to="/buat-tiket"
        className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 hover:bg-blue-600 text-white font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 text-base"
      >
        <Ticket className="w-5 h-5" />
        Buat Tiket Sekarang
      </Link>
    </section>
  </div>
);

export default LandingPage;
