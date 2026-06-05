import { useNavigate } from 'react-router-dom';
import { Eye, Archive, RotateCcw, ChevronUp, ChevronDown, Minus, Ticket } from 'lucide-react';
import Badge from '../common/Badge';
import StatusSelect from '../common/StatusSelect';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Button from '../common/Button';
import { formatDateTime, formatRelativeTime } from '../../utils/formatters';
import { TICKET_STATUS_LABELS } from '../../utils/constants';

/**
 * TicketTable — BASE COMPONENT (reused by TicketListPage & ArchivedTicketsPage)
 *
 * isArchiveView=false → shows status select + bulk archive button
 * isArchiveView=true  → shows static badge + "Archived By / Archived At" columns + bulk restore
 */
const TicketTable = ({
  tickets = [],
  pagination,
  isLoading,
  isRefreshing,
  selectedIds,
  updatingIds,
  params,
  onSearch,
  onStatusFilter,
  onSort,
  onPageChange,
  onToggleSelect,
  onToggleSelectAll,
  onQuickUpdateStatus,
  onBulkArchive,
  onBulkRestore,
  isArchiveView = false,
}) => {
  const navigate = useNavigate();
  const allSelected = tickets.length > 0 && selectedIds.size === tickets.length;
  const someSelected = selectedIds.size > 0 && !allSelected;

  // ── Sort Header ──────────────────────────────────────────────────────────────
  const SortIcon = ({ field }) => {
    if (params.sortBy !== field) return <Minus className="w-3 h-3 text-slate-300" />;
    return params.sortOrder === 'asc'
      ? <ChevronUp className="w-3 h-3 text-blue-600" />
      : <ChevronDown className="w-3 h-3 text-blue-600" />;
  };

  const handleSort = (field) => {
    const newOrder = params.sortBy === field && params.sortOrder === 'desc' ? 'asc' : 'desc';
    onSort(field, newOrder);
  };

  const Th = ({ field, children, className = '' }) => (
    <th
      onClick={() => handleSort(field)}
      className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-800 select-none whitespace-nowrap ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        {children} <SortIcon field={field} />
      </span>
    </th>
  );

  const colCount = isArchiveView ? 9 : 7;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchBar
          value={params.search}
          onChange={onSearch}
          placeholder="Cari no. tiket, nama, email, resi..."
          className="flex-1"
        />
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isArchiveView && (
            <select
              value={params.status}
              onChange={(e) => onStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer hover:border-slate-400 transition-colors shadow-sm"
            >
              <option value="">Semua Status</option>
              {Object.entries(TICKET_STATUS_LABELS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          )}
          {selectedIds.size > 0 && (
            <>
              <span className="text-xs text-slate-500 px-1">{selectedIds.size} dipilih</span>
              {!isArchiveView
                ? <Button variant="danger"    size="sm" icon={Archive}   onClick={() => onBulkArchive(selectedIds)}>Arsipkan</Button>
                : <Button variant="secondary" size="sm" icon={RotateCcw} onClick={() => onBulkRestore(selectedIds)}>Pulihkan</Button>
              }
            </>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {isRefreshing && <div className="h-0.5 bg-gradient-to-r from-blue-600 to-red-600 animate-pulse" />}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected; }}
                    onChange={onToggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 cursor-pointer accent-blue-600"
                  />
                </th>
                <Th field="ticketNumber">No. Tiket</Th>
                <Th field="customerName">Pelanggan</Th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                <Th field="status">Status</Th>
                {isArchiveView && (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Archived By</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">Archived At</th>
                  </>
                )}
                <Th field="createdAt">Tanggal</Th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: colCount }).map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="skeleton h-4 rounded" style={{ width: `${55 + (j * 17) % 40}%` }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : tickets.length === 0
                  ? (
                    <tr>
                      <td colSpan={colCount}>
                        <EmptyState
                          icon={Ticket}
                          title={isArchiveView ? 'Tidak ada tiket terarsip' : 'Tidak ada tiket ditemukan'}
                          description={params.search || params.status
                            ? 'Coba ubah kata kunci atau filter pencarian.'
                            : isArchiveView ? 'Belum ada tiket yang diarsipkan.' : 'Belum ada tiket yang masuk.'}
                        />
                      </td>
                    </tr>
                  )
                  : tickets.map((ticket) => {
                      const archiveLog = isArchiveView
                        ? [...(ticket.auditLog || [])].reverse().find((l) => l?.action === 'ARCHIVE')
                        : null;

                      return (
                        <tr
                          key={ticket._id}
                          onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                          className={`hover:bg-blue-50/50 transition-colors cursor-pointer group ${selectedIds.has(ticket._id) ? 'bg-blue-50' : ''}`}
                        >
                          <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedIds.has(ticket._id)}
                              onChange={() => onToggleSelect(ticket._id)}
                              className="w-4 h-4 rounded border-slate-300 bg-white text-blue-600 cursor-pointer accent-blue-600"
                            />
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-mono text-xs font-bold text-blue-700">{ticket.ticketNumber}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <p className="text-slate-800 text-sm font-medium leading-tight">{ticket.customerName}</p>
                            <p className="text-slate-400 text-xs mt-0.5">{ticket.email}</p>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">{ticket.category}</span>
                          </td>
                          <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                            {isArchiveView
                              ? <Badge status={ticket.status} />
                              : <StatusSelect
                                  ticketId={ticket._id}
                                  currentStatus={ticket.status}
                                  isUpdating={updatingIds.has(ticket._id)}
                                  onUpdate={onQuickUpdateStatus}
                                  disabled={ticket.isArchived}
                                />
                            }
                          </td>
                          {isArchiveView && (
                            <>
                              <td className="px-4 py-3.5 text-slate-500 text-xs">
                                {archiveLog?.performedBy?.fullname || '—'}
                              </td>
                              <td className="px-4 py-3.5 text-slate-500 text-xs whitespace-nowrap">
                                {archiveLog?.performedAt ? formatRelativeTime(archiveLog.performedAt) : '—'}
                              </td>
                            </>
                          )}
                          <td className="px-4 py-3.5 text-slate-400 text-xs whitespace-nowrap">{formatDateTime(ticket.createdAt)}</td>
                          <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                              className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
              }
            </tbody>
          </table>
        </div>
      </div>

      <Pagination pagination={pagination} onPageChange={onPageChange} />
    </div>
  );
};

export default TicketTable;
