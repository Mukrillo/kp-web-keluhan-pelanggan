const colorMap = {
  indigo:  { bg: 'bg-blue-50',    icon: 'text-blue-600',    val: 'text-blue-700',    border: 'border-blue-200'    },
  blue:    { bg: 'bg-blue-50',    icon: 'text-blue-500',    val: 'text-blue-700',    border: 'border-blue-200'    },
  amber:   { bg: 'bg-amber-50',   icon: 'text-amber-600',   val: 'text-amber-700',   border: 'border-amber-200'   },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', val: 'text-emerald-700', border: 'border-emerald-200' },
  slate:   { bg: 'bg-slate-100',  icon: 'text-slate-500',   val: 'text-slate-700',   border: 'border-slate-200'   },
  violet:  { bg: 'bg-violet-50',  icon: 'text-violet-600',  val: 'text-violet-700',  border: 'border-violet-200'  },
};

const StatCard = ({ title, value, icon: Icon, color = 'indigo', isLoading = false }) => {
  const c = colorMap[color] || colorMap.indigo;

  if (isLoading) {
    return (
      <div className="bg-white border-2 border-slate-200 rounded-xl p-5 animate-pulse shadow-sm">
        <div className="skeleton h-10 w-10 rounded-xl mb-4" />
        <div className="skeleton h-7 w-12 mb-2 rounded" />
        <div className="skeleton h-3 w-24 rounded" />
      </div>
    );
  }

  return (
    <div className={`bg-white border-2 ${c.border} rounded-xl p-5 hover:shadow-md transition-all duration-200 group cursor-default shadow-sm`}>
      <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
        <Icon className={`w-5 h-5 ${c.icon}`} />
      </div>
      <p className={`text-2xl font-bold mb-0.5 ${c.val} tabular-nums`}>
        {value?.toLocaleString('id-ID') ?? '—'}
      </p>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
    </div>
  );
};

export default StatCard;
