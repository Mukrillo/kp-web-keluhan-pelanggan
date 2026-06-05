import AdminLayout from '../../layouts/AdminLayout';
import Topbar from '../../components/admin/Topbar';
import TicketTable from '../../components/admin/TicketTable';
import { useTickets } from '../../hooks/useTickets';

const ArchivedTicketsPage = () => {
  const {
    tickets, pagination, isLoading, isRefreshing, selectedIds, updatingIds,
    params, setFilter, setPage, toggleSelect, toggleSelectAll, bulkRestore, refresh,
  } = useTickets({ isArchiveView: true });

  return (
    <AdminLayout>
      <Topbar
        title="Arsip Tiket"
        subtitle="Tiket yang telah diarsipkan bersifat read-only"
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
          onBulkRestore={bulkRestore}
          isArchiveView={true}
        />
      </main>
    </AdminLayout>
  );
};

export default ArchivedTicketsPage;
