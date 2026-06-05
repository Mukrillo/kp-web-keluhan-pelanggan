import { Plus, ArrowRightLeft, Archive, RotateCcw, MessageSquare, HelpCircle } from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';
import { AUDIT_ACTION_LABELS } from '../../utils/constants';
import { getAuditActionColor } from '../../utils/formatters';

const ACTION_ICONS = {
  CREATED:        Plus,
  STATUS_CHANGE:  ArrowRightLeft,
  ARCHIVE:        Archive,
  RESTORE:        RotateCcw,
  RESPONSE_ADDED: MessageSquare,
};

const getDescription = (log) => {
  try {
    switch (log.action) {
      case 'CREATED':
        return `Tiket dibuat dengan status ${log.newValue?.status || 'OPEN'}, kategori ${log.newValue?.category || '—'}`;
      case 'STATUS_CHANGE':
        return `Status diubah: ${log.oldValue || '—'} → ${log.newValue || '—'}`;
      case 'RESPONSE_ADDED': {
        const resp = String(log.newValue || '');
        return `Respon: "${resp.length > 120 ? resp.slice(0, 120) + '...' : resp}"`;
      }
      case 'ARCHIVE':
        return 'Tiket diarsipkan — berstatus read-only';
      case 'RESTORE':
        return 'Tiket dipulihkan dari arsip';
      default:
        return String(log.action);
    }
  } catch {
    return log.action || '—';
  }
};

const TimelineEntry = ({ log, isLast }) => {
  // Guard against null / corrupt entries
  if (!log || !log.action) return null;

  const Icon   = ACTION_ICONS[log.action] || HelpCircle;
  const colors = getAuditActionColor(log.action);

  return (
    <div className="flex gap-4 group">
      {/* Dot + line */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${colors}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        {!isLast && <div className="w-px flex-1 min-h-4 bg-slate-200 mt-1.5 mb-0" />}
      </div>

      {/* Content */}
      <div className={`flex-1 min-w-0 ${!isLast ? 'pb-5' : ''}`}>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
          <span className="text-sm font-semibold text-slate-800">
            {AUDIT_ACTION_LABELS[log.action] || log.action}
          </span>
          <span className="text-slate-400 text-xs">
            {log.performedAt ? formatDateTime(log.performedAt) : 'Waktu tidak diketahui'}
          </span>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed">{getDescription(log)}</p>
        {log.performedBy && (
          <p className="text-slate-400 text-xs mt-1">
            oleh {log.performedBy?.fullname || log.performedBy?.username || 'System'}
          </p>
        )}
      </div>
    </div>
  );
};

const TicketTimeline = ({ auditLog = [] }) => {
  // Filter corrupt entries, sort DESC
  const sorted = [...auditLog]
    .filter((l) => l && l.action)
    .sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt));

  if (sorted.length === 0) {
    return <p className="text-slate-400 text-sm py-4">Belum ada aktivitas tercatat.</p>;
  }

  return (
    <div>
      {sorted.map((log, idx) => (
        <TimelineEntry
          key={`${log.action}-${log.performedAt}-${idx}`}
          log={log}
          isLast={idx === sorted.length - 1}
        />
      ))}
    </div>
  );
};

export default TicketTimeline;
