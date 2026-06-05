import { MessageSquare } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDateTime, getAuditActionColor } from '../../utils/formatters';
import { CATEGORY_LABELS, AUDIT_ACTION_LABELS } from '../../utils/constants';

const TrackingResult = ({ ticket }) => {
  if (!ticket) return null;

  const sortedLog = [...(ticket.auditLog || [])]
    .filter((l) => l && l.action && l.performedAt)
    .sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt));

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Status card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Nomor Tiket</p>
            <p className="text-blue-700 font-mono font-bold text-2xl tracking-wider">{ticket.ticketNumber}</p>
          </div>
          <Badge status={ticket.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {[
            ['Nama Pelanggan', ticket.customerName],
            ['Kategori', CATEGORY_LABELS[ticket.category] || ticket.category],
            ['Tanggal Dibuat', formatDateTime(ticket.createdAt)],
            ['Terakhir Diperbarui', formatDateTime(ticket.updatedAt)],
          ].map(([label, val]) => (
            <div key={label}>
              <p className="text-slate-400 text-xs mb-0.5">{label}</p>
              <p className="text-slate-800 text-sm font-medium">{val || '—'}</p>
            </div>
          ))}
        </div>

        {ticket.adminResponse && (
          <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-semibold">Respons Admin</span>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed">{ticket.adminResponse}</p>
            {ticket.handledBy && (
              <p className="text-slate-400 text-xs mt-2">
                oleh {ticket.handledBy.fullname || ticket.handledBy.username}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-slate-900 font-semibold text-sm mb-5">Riwayat Aktivitas</h3>
        {sortedLog.length === 0 ? (
          <p className="text-slate-400 text-sm">Belum ada aktivitas.</p>
        ) : (
          <div>
            {sortedLog.map((log, idx) => {
              const colors = getAuditActionColor(log.action);
              const isLast = idx === sortedLog.length - 1;
              return (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${colors}`}>
                      {sortedLog.length - idx}
                    </div>
                    {!isLast && <div className="w-px flex-1 min-h-4 bg-slate-200 mt-1.5" />}
                  </div>
                  <div className={`flex-1 min-w-0 ${!isLast ? 'pb-4' : ''}`}>
                    <p className="text-slate-800 text-sm font-medium">
                      {AUDIT_ACTION_LABELS[log.action] || log.action}
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">{formatDateTime(log.performedAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingResult;
