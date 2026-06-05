const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-2',
  lg: 'w-12 h-12 border-[3px]',
  xl: 'w-16 h-16 border-4',
};

const Spinner = ({ size = 'md', className = '' }) => (
  <div
    className={`rounded-full border-slate-700 border-t-indigo-500 animate-spin ${sizes[size]} ${className}`}
  />
);

export const FullPageSpinner = ({ label = 'Loading...' }) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm z-50 gap-4">
    <Spinner size="xl" />
    <p className="text-slate-400 text-sm animate-pulse">{label}</p>
  </div>
);

export default Spinner;
