import { RefreshCw } from 'lucide-react';

const Topbar = ({ title, subtitle, onRefresh, isRefreshing = false, actions }) => (
  <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-20 shadow-sm">
    <div className="flex-1 min-w-0">
      <h1 className="text-slate-900 font-semibold text-sm leading-tight">{title}</h1>
      {subtitle && <p className="text-slate-400 text-xs mt-0.5">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-2 flex-shrink-0">
      {actions}
      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh"
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  </header>
);

export default Topbar;
