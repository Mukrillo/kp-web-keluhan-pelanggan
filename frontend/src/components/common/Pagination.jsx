import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange, className = '' }) => {
  if (!pagination || pagination.totalPages <= 1) return null;

  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination;
  const start = (currentPage - 1) * itemsPerPage + 1;
  const end   = Math.min(currentPage * itemsPerPage, totalItems);

  // Build smart page range with ellipsis
  const getPages = () => {
    const delta = 1;
    const range = [];
    const pages = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) range.push(i);

    if (currentPage - delta > 2) pages.push(1, '...');
    else pages.push(1);

    pages.push(...range);

    if (currentPage + delta < totalPages - 1) pages.push('...', totalPages);
    else if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const Btn = ({ page, disabled, children, isActive }) => (
    <button
      onClick={() => !disabled && onPageChange(page)}
      disabled={disabled}
      className={`
        w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium
        transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed
        ${isActive
          ? 'bg-blue-700 text-white shadow-md shadow-blue-500/20'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
        }
      `}
    >
      {children}
    </button>
  );

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <p className="text-slate-500 text-sm">
        Menampilkan{' '}
        <span className="text-slate-800 font-medium">{start}–{end}</span>
        {' '}dari{' '}
        <span className="text-slate-800 font-medium">{totalItems.toLocaleString('id-ID')}</span>
        {' '}hasil
      </p>
      <div className="flex items-center gap-1">
        <Btn page={1} disabled={currentPage === 1}><ChevronsLeft className="w-4 h-4" /></Btn>
        <Btn page={currentPage - 1} disabled={currentPage === 1}><ChevronLeft className="w-4 h-4" /></Btn>

        {getPages().map((p, i) =>
          p === '...'
            ? <span key={`dot-${i}`} className="w-8 text-center text-slate-600 text-sm">…</span>
            : <Btn key={p} page={p} isActive={p === currentPage}>{p}</Btn>
        )}

        <Btn page={currentPage + 1} disabled={currentPage === totalPages}><ChevronRight className="w-4 h-4" /></Btn>
        <Btn page={totalPages} disabled={currentPage === totalPages}><ChevronsRight className="w-4 h-4" /></Btn>
      </div>
    </div>
  );
};

export default Pagination;
