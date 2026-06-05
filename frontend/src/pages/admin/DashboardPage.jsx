import { Link } from 'react-router-dom';
import { Ticket, TrendingUp, Clock, CheckCircle2, XCircle, Archive, Eye, ChevronRight } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import Topbar from '../../components/admin/Topbar';
import StatCard from '../../components/admin/StatCard';
import Badge from '../../components/common/Badge';
import { useDashboard } from '../../hooks/useDashboard';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters';

const STAT_CONFIG = [
  { key: 'total',      title: 'Total Tiket',  icon: Ticket,         color: 'indigo'  },
  { key: 'open',       title: 'Tiket Baru',   icon: TrendingUp,     color: 'blue'    },
  { key: 'inProgress', title: 'Diproses',     icon: Clock,          color: 'amber'   },
  { key: 'resolved',   title: 'Selesai',      icon: CheckCircle2,   color: 'emerald' },
  { key: 'closed',     title: 'Ditutup',      icon: XCircle,        color: 'slate'   },
  { key: 'archived',   title: 'Diarsipkan',   icon: Archive,        color: 'violet'  },
];

const DashboardPage = () => {
  const { stats, latestTickets, isLoading, isRefreshing, error, refresh } = useDashboard();

  return (
    <AdminLayout>
      <Topbar
        title="Dashboard"
        subtitle="Ringkasan manajemen tiket keluhan"
        onRefresh={refresh}
        isRefreshing={isRefreshing}
      />
      <main className="flex-1 p-6 space-y-6">
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
            {error} —{' '}
            <button onClick={refresh} className="underline hover:no-underline">
              Coba lagi
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAT_CONFIG.map(({ key, title, icon, color }) => (
            <StatCard
              key={key}
              title={title}
              value={stats?.[key]}
              icon={icon}
              color={color}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Latest tickets */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-slate-900 font-semibold text-sm">Tiket Terbaru</h2>
            <Link
              to="/admin/tickets"
              className="text-blue-600 hover:text-blue-800 text-xs inline-flex items-center gap-1 transition-colors"
            >
              Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="divide-y divide-slate-700/30">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-6 py-4 flex items-center gap-4">
                  <div className="skeleton h-4 w-36 rounded" />
                  <div className="skeleton h-4 w-28 rounded" />
                  <div className="skeleton h-5 w-20 rounded-full ml-auto" />
                </div>
              ))}
            </div>
          ) : latestTickets.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">Belum ada tiket.</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {latestTickets.map((ticket) => (
                <Link
                  key={ticket._id}
                  to={`/admin/tickets/${ticket._id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-mono text-xs font-bold text-blue-700">{ticket.ticketNumber}</p>
                    <p className="text-slate-800 text-sm font-medium truncate mt-0.5">{ticket.customerName}</p>
                    <p className="text-slate-400 text-xs truncate">{ticket.email}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-slate-400 text-xs hidden sm:block">{formatRelativeTime(ticket.createdAt)}</span>
                    <Badge status={ticket.status} />
                    <Eye className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
};

export default DashboardPage;
