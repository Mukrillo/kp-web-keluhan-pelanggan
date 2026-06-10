import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Archive, RotateCcw, Save, User, Mail, Phone,
  Hash, Tag, FileText, Paperclip, Activity, MessageSquare
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import Topbar from '../../components/admin/Topbar';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import Button from '../../components/common/Button';
import TicketTimeline from '../../components/admin/TicketTimeline';
import { useTicketDetail } from '../../hooks/useTicketDetail';
import { adminService } from '../../services/admin.service';
import { formatDateTime, formatFileSize, getCategoryLabel } from '../../utils/formatters';
import { TICKET_STATUS_OPTIONS } from '../../utils/constants';
import toast from 'react-hot-toast';

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-slate-500" />
    </div>
    <div className="min-w-0">
      <p className="text-slate-400 text-xs mb-0.5">{label}</p>
      <p className="text-slate-800 text-sm font-medium break-words">{value || '—'}</p>
    </div>
  </div>
);

const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ticket, isLoading, isUpdating, error, updateTicket, refresh } = useTicketDetail(id);

  const [selectedStatus, setSelectedStatus] = useState('');
  const [response, setResponse] = useState(null); // null = belum diubah, '' = sengaja dikosongkan
  const [isBulkOp, setIsBulkOp] = useState(false);

  // Init form from ticket once loaded
  // null = belum disentuh admin → tampilkan nilai dari database
  // '' atau string lain = admin sudah mengubah nilai di textarea
  const resolvedStatus = selectedStatus || ticket?.status || '';
  const resolvedResponse = response !== null ? response : (ticket?.adminResponse || '');

  const handleUpdate = async () => {
    const updates = {};
    if (resolvedStatus !== ticket?.status) updates.status = resolvedStatus;
    // Kirim adminResponse jika admin sudah menyentuh textarea (response !== null)
    // Ini memungkinkan admin mengosongkan respons (string kosong)
    if (response !== null && response !== (ticket?.adminResponse || '')) updates.adminResponse = response;
    if (!Object.keys(updates).length) { toast('Tidak ada perubahan.', { icon: 'ℹ️' }); return; }
    await updateTicket(updates);
    // Reset local overrides — useTicketDetail re-fetches on success
    setSelectedStatus('');
    setResponse(null);
  };

  const handleArchive = async () => {
    if (!window.confirm('Arsipkan tiket ini? Tiket tidak dapat dimodifikasi setelah diarsipkan.')) return;
    setIsBulkOp(true);
    try {
      await adminService.bulkArchive([id]);
      toast.success('Tiket berhasil diarsipkan.');
      refresh();
    } catch (err) {
      toast.error(err.message || 'Gagal mengarsipkan tiket.');
    } finally {
      setIsBulkOp(false);
    }
  };

  const handleRestore = async () => {
    setIsBulkOp(true);
    try {
      await adminService.bulkRestore([id]);
      toast.success('Tiket berhasil dipulihkan.');
      refresh();
    } catch (err) {
      toast.error(err.message || 'Gagal memulihkan tiket.');
    } finally {
      setIsBulkOp(false);
    }
  };

  return (
    <AdminLayout>
      <Topbar
        title={ticket ? `Tiket ${ticket.ticketNumber}` : 'Detail Tiket'}
        subtitle={ticket ? `${ticket.customerName} — Dibuat ${formatDateTime(ticket.createdAt)}` : ''}
        onRefresh={refresh}
        actions={
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Kembali
          </Button>
        }
      />
      <main className="flex-1 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="p-5 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error} —{' '}
            <button onClick={refresh} className="underline hover:no-underline">
              Coba lagi
            </button>
          </div>
        ) : ticket ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 max-w-7xl">
            {/* ── Left: Detail + Update Form ────────────────────────── */}
            <div className="xl:col-span-2 space-y-5">
              {/* Status Bar */}
              {ticket.isArchived && (
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <Archive className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-amber-700 text-sm font-medium">
                    Tiket ini diarsipkan dan bersifat read-only. Pulihkan untuk mengubah.
                  </p>
                </div>
              )}

              {/* Customer Info */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <p className="text-xs font-mono text-blue-600 mb-1">{ticket.ticketNumber}</p>
                    <h2 className="text-slate-900 font-bold text-xl">{ticket.customerName}</h2>
                  </div>
                  <Badge status={ticket.status} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoRow icon={Mail}     label="Email"      value={ticket.email} />
                  <InfoRow icon={Phone}    label="Telepon"    value={ticket.phone} />
                  <InfoRow icon={Hash}     label="No. Resi"   value={ticket.resiNumber} />
                  <InfoRow icon={Tag}      label="Kategori"   value={getCategoryLabel(ticket.category)} />
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-slate-400" />
                  <h3 className="text-slate-900 font-semibold text-sm">Deskripsi Keluhan</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</p>
              </div>

              {/* Attachment */}
              {ticket.attachment && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-2 mb-3">
                    <Paperclip className="w-4 h-4 text-slate-400" />
                    <h3 className="text-slate-900 font-semibold text-sm">Lampiran</h3>
                  </div>
                  <a
                    href={(import.meta.env.VITE_API_URL || '') + ticket.attachment.filepath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-400 transition-colors group"
                  >
                    <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-700 text-sm font-medium truncate group-hover:text-blue-600 transition-colors">
                        {ticket.attachment.filename}
                      </p>
                      <p className="text-slate-400 text-xs">{formatFileSize(ticket.attachment.filesize)}</p>
                    </div>
                  </a>
                </div>
              )}

              {/* Update Form */}
              {!ticket.isArchived && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-md">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                    <h3 className="text-slate-900 font-semibold text-sm">Update Tiket</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
                      <select
                        value={resolvedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        disabled={isUpdating}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-800 rounded-lg text-sm focus:outline-none focus:border-blue-500 cursor-pointer transition-colors shadow-sm"
                      >
                        {TICKET_STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Respons Admin
                      </label>
                      <textarea
                        value={resolvedResponse}
                        onChange={(e) => setResponse(e.target.value)}
                        rows={4}
                        disabled={isUpdating}
                        placeholder="Tulis respons kepada pelanggan..."
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 text-slate-800 rounded-lg text-sm placeholder:text-slate-400 focus:outline-none focus:border-blue-500 resize-none leading-relaxed transition-colors disabled:opacity-50 shadow-sm"
                      />
                      <p className="text-xs text-slate-400 mt-1">{resolvedResponse.length}/2000</p>
                    </div>
                    <Button
                      variant="primary"
                      size="md"
                      icon={Save}
                      isLoading={isUpdating}
                      onClick={handleUpdate}
                      className="w-full"
                    >
                      Simpan Perubahan
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Meta + Timeline ─────────────────────────────── */}
            <div className="space-y-5">
              {/* Actions */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md">
                <h3 className="text-slate-900 font-semibold text-sm mb-4">Tindakan</h3>
                <div className="space-y-2">
                  {!ticket.isArchived ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Archive}
                      isLoading={isBulkOp}
                      onClick={handleArchive}
                      className="w-full"
                    >
                      Arsipkan Tiket
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={RotateCcw}
                      isLoading={isBulkOp}
                      onClick={handleRestore}
                      className="w-full"
                    >
                      Pulihkan dari Arsip
                    </Button>
                  )}
                </div>
              </div>

              {/* Handled By */}
              {ticket.handledBy && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md">
                  <h3 className="text-slate-900 font-semibold text-sm mb-3">Ditangani Oleh</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-bold">
                        {ticket.handledBy.fullname?.charAt(0)?.toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-800 text-sm font-medium">{ticket.handledBy.fullname}</p>
                      <p className="text-slate-400 text-xs">@{ticket.handledBy.username}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Audit Timeline */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <h3 className="text-slate-900 font-semibold text-sm">Riwayat Audit</h3>
                </div>
                <TicketTimeline auditLog={ticket.auditLog || []} />
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </AdminLayout>
  );
};

export default TicketDetailPage;
