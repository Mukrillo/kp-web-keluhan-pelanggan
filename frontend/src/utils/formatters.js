import { TICKET_STATUS_LABELS, CATEGORY_LABELS } from './constants';

// ─── Date Formatters ──────────────────────────────────────────────────────────

export const formatDate = (date) => {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return '—'; }
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return '—'; }
};

export const formatRelativeTime = (date) => {
  if (!date) return '—';
  try {
    const diff = Date.now() - new Date(date).getTime();
    const s = Math.floor(diff / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (s < 60)  return 'Baru saja';
    if (m < 60)  return `${m} menit lalu`;
    if (h < 24)  return `${h} jam lalu`;
    if (d < 7)   return `${d} hari lalu`;
    return formatDate(date);
  } catch { return '—'; }
};

export const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '—';
  if (bytes < 1024)         return `${bytes} B`;
  if (bytes < 1024 * 1024)  return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

// ─── Label Getters ────────────────────────────────────────────────────────────

export const getStatusLabel    = (s) => TICKET_STATUS_LABELS[s] || s || '—';
export const getCategoryLabel  = (c) => CATEGORY_LABELS[c] || c || '—';

// ─── Color Helpers ────────────────────────────────────────────────────────────

export const getStatusColor = (status) => {
  const map = {
    OPEN:        'bg-blue-500/15 text-blue-400 border border-blue-500/20',
    IN_PROGRESS: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
    RESOLVED:    'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
    CLOSED:      'bg-slate-500/15 text-slate-400 border border-slate-500/20',
  };
  return map[status] || 'bg-slate-500/15 text-slate-400';
};

export const getStatusDotColor = (status) => {
  const map = {
    OPEN:        'bg-blue-400',
    IN_PROGRESS: 'bg-amber-400',
    RESOLVED:    'bg-emerald-400',
    CLOSED:      'bg-slate-400',
  };
  return map[status] || 'bg-slate-500';
};

export const getAuditActionColor = (action) => {
  const map = {
    CREATED:        'text-emerald-400 bg-emerald-400/10',
    STATUS_CHANGE:  'text-blue-400 bg-blue-400/10',
    ARCHIVE:        'text-amber-400 bg-amber-400/10',
    RESTORE:        'text-violet-400 bg-violet-400/10',
    RESPONSE_ADDED: 'text-cyan-400 bg-cyan-400/10',
  };
  return map[action] || 'text-slate-400 bg-slate-400/10';
};
