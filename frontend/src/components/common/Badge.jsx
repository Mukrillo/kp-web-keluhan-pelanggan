import { getStatusColor, getStatusDotColor, getStatusLabel } from '../../utils/formatters';

const Badge = ({ status, showDot = true, className = '' }) => {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusColor(status)} ${className}`}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${getStatusDotColor(status)}`} />
      )}
      {getStatusLabel(status)}
    </span>
  );
};

export default Badge;
