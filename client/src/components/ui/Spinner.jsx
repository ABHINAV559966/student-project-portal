const Spinner = ({ size = 'md', label = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12" role="status" aria-label={label}>
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-primary-200 dark:border-primary-900`}
          style={{ borderWidth: size === 'lg' ? '4px' : '3px' }}
        />
        {/* Spinning ring */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full border-primary-500 border-t-transparent animate-spin`}
          style={{ borderWidth: size === 'lg' ? '4px' : '3px' }}
        />
      </div>
      {label && (
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );
};

export default Spinner;
