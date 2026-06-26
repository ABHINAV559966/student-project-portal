import { HiMenu, HiSun, HiMoon, HiBell } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ onMenuClick, pageTitle }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 glass-card rounded-none lg:rounded-2xl border-b lg:border dark:border-slate-700/50 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden btn-ghost p-2 rounded-lg"
            aria-label="Open menu"
            id="navbar-menu-btn"
          >
            <HiMenu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {pageTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell (decorative) */}
          <button
            className="btn-ghost p-2 rounded-lg relative"
            aria-label="Notifications"
            id="navbar-notif-btn"
          >
            <HiBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
          </button>

          {/* Dark mode toggle */}
          <motion.button
            whileTap={{ scale: 0.85, rotate: 15 }}
            onClick={toggleTheme}
            id="theme-toggle-btn"
            className="btn-ghost p-2 rounded-lg"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? (
              <HiSun className="w-5 h-5 text-amber-400" />
            ) : (
              <HiMoon className="w-5 h-5 text-slate-600" />
            )}
          </motion.button>

          {/* User avatar */}
          <div
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold shadow-md cursor-pointer"
            title="Student User"
            id="navbar-avatar"
          >
            S
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
