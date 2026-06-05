import AdminLayout from '../../layouts/AdminLayout';
import Topbar from '../../components/admin/Topbar';
import TicketTable from '../../components/admin/TicketTable';
import { useTickets } from '../../hooks/useTickets';

const TicketListPage = () => {
  const {
    tickets, pagination, isLoading, isRefreshing, selectedIds, updatingIds,
    params, setFilter, setPage, toggleSelect, toggleSelectAll,
    quickUpdateStatus, bulkArchive, refresh,
  } = useTickets({ isArchiveView: false });

  return (
    <AdminLayout>
      <Topbar
        title="Manajemen Tiket"
        subtitle="Kelola semua tiket keluhan pelanggan"
        onRefresh={refresh}
        isRefreshing={isRefreshing}
      />
      <main className="flex-1 p-6">
        <TicketTable
          tickets={tickets}
          pagination={pagination}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          selectedIds={selectedIds}
          updatingIds={updatingIds}
          params={params}
          onSearch={(v) => setFilter('search', v)}
          onStatusFilter={(v) => setFilter('status', v)}
          onSort={(field, order) => { setFilter('sortBy', field); setFilter('sortOrder', order); }}
          onPageChange={setPage}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onQuickUpdateStatus={quickUpdateStatus}
          onBulkArchive={bulkArchive}
          isArchiveView={false}
        />
      </main>
    </AdminLayout>
  );
};

export default TicketListPage;
