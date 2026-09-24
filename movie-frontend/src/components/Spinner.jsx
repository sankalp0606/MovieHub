const Spinner = ({ size = 'md', label = 'Loading...' }) => {
  const sizeMap = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-slate-200">
      <div className={`animate-spin rounded-full border-2 border-white/20 border-t-violet-400 ${sizeMap[size] || sizeMap.md}`} />
      {label && <span className="text-sm text-slate-300">{label}</span>}
    </div>
  );
};

export default Spinner;
