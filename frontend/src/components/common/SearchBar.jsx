import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
  value = '',
  onChange,
  placeholder = 'Cari...',
  debounceMs = 400,
  className = '',
}) => {
  const [local, setLocal] = useState(value);
  const timerRef = useRef(null);

  // Sync when parent resets value
  useEffect(() => { setLocal(value); }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setLocal(v);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), debounceMs);
  };

  const handleClear = () => {
    setLocal('');
    clearTimeout(timerRef.current);
    onChange('');
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      <input
        type="text"
        value={local}
        onChange={handleChange}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-9 py-2.5 bg-white border border-slate-300 rounded-lg
          text-sm text-slate-800 placeholder:text-slate-400
          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30
          transition-all duration-200 shadow-sm
        "
      />
      {local && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          type="button"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
