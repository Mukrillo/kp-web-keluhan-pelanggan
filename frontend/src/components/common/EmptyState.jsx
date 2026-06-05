import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'Tidak ada data',
  description = '',
  action,
  className = '',
}) => (
  <div className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}>
    <div className="w-16 h-16 rounded-2xl bg-slate-700/50 border border-slate-700 flex items-center justify-center mb-4">
      <Icon className="w-8 h-8 text-slate-500" />
    </div>
    <h3 className="text-base font-semibold text-slate-300 mb-1.5">{title}</h3>
    {description && (
      <p className="text-slate-500 text-sm max-w-xs leading-relaxed mb-5">{description}</p>
    )}
    {action}
  </div>
);

export default EmptyState;
