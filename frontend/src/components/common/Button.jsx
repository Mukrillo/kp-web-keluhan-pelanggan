import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'bg-blue-700 hover:bg-blue-600 text-white shadow-md shadow-blue-500/20 hover:shadow-blue-500/30',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 shadow-sm',
  danger:    'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-500/20',
  ghost:     'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  success:   'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20',
  outline:   'bg-transparent border border-blue-600 text-blue-700 hover:bg-blue-50',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-2.5 text-sm gap-2',
  xl: 'px-8 py-3 text-base gap-2',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  type = 'button',
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || isLoading}
    className={`
      inline-flex items-center justify-center font-medium rounded-lg
      transition-all duration-200 cursor-pointer select-none
      disabled:opacity-50 disabled:cursor-not-allowed
      focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
      focus-visible:ring-offset-white
      ${variants[variant] || variants.primary}
      ${sizes[size] || sizes.md}
      ${className}
    `}
    {...props}
  >
    {isLoading
      ? <Loader2 className="w-4 h-4 animate-spin" />
      : Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />
    }
    {children}
    {!isLoading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
  </button>
);

export default Button;
