import { useEffect, useRef } from 'react';
import { HiSearch, HiX } from 'react-icons/hi';

const SearchBar = ({ value, onChange, placeholder = 'Search tasks...' }) => {
  const inputRef = useRef(null);

  // Keyboard shortcut: Ctrl+K or Cmd+K to focus search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex-1 min-w-0">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
        <HiSearch className="w-5 h-5 text-slate-400" />
      </div>

      <input
        ref={inputRef}
        id="task-search-input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input pl-11 pr-10"
        aria-label="Search tasks"
        autoComplete="off"
      />

      {/* Clear button */}
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Clear search"
          id="search-clear-btn"
        >
          <HiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
