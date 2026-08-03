const STATUS_STYLES = {
  active:   { dot: 'bg-emerald-500', classes: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  redeemed: { dot: 'bg-blue-500',    classes: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  expired:  { dot: 'bg-red-500',     classes: 'bg-red-50 text-red-700 ring-red-600/20' },
};

const DEFAULT_STYLE = { dot: 'bg-stone-400', classes: 'bg-stone-50 text-stone-700 ring-stone-600/20' };

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || DEFAULT_STYLE;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full capitalize ring-1 ring-inset ${style.classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

export default StatusBadge;
