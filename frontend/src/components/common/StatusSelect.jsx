import { Loader2 } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'OPEN',        label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED',    label: 'Resolved' },
  { value: 'CLOSED',      label: 'Closed' },
];

/**
 * StatusSelect — inline status dropdown with Set-based update lock
 * Shows spinner while updating the same row, normal select otherwise.
 */
const StatusSelect = ({ ticketId, currentStatus, isUpdating, onUpdate, disabled = false }) => {
  if (isUpdating) {
    return (
      <span className="inline-flex items-center gap-1.5 text-slate-400 text-xs px-1">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Updating...</span>
      </span>
    );
  }

  return (
    <select
      value={currentStatus}
      onChange={(e) => onUpdate(ticketId, e.target.value)}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()} // prevent row click navigation
      className="
        bg-slate-700 border border-slate-600 text-slate-200 text-xs
        rounded-lg px-2.5 py-1.5 cursor-pointer
        focus:outline-none focus:border-indigo-500
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors hover:border-slate-500
      "
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
};

export default StatusSelect;
