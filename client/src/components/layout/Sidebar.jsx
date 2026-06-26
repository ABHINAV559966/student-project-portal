import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiHome,
  HiClipboardList,
  HiX,
  HiLightningBolt,
} from 'react-icons/hi';

const navItems = [
  { to: '/', label: 'Dashboard', icon: <HiHome className="w-5 h-5" />, id: 'nav-dashboard' },
  { to: '/tasks', label: 'All Tasks', icon: <HiClipboardList className="w-5 h-5" />, id: 'nav-tasks' },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-64 z-30 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="h-full flex flex-col glass-card rounded-none lg:rounded-2xl border-r lg:border dark:border-slate-700/50 overflow-hidden">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                <HiLightningBolt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-base font-black text-slate-900 dark:text-white leading-none">
                  ProjectHub
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Student Portal
                </p>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden btn-ghost p-2 rounded-lg"
              aria-label="Close sidebar"
              id="sidebar-close-btn"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1" aria-label="Main navigation">
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-4 mb-3">
              Navigation
            </p>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                id={item.id}
                onClick={() => onClose()}
                className={({ isActive }) =>
                  isActive ? 'sidebar-link-active block' : 'sidebar-link block'
                }
              >
                <span className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50">
            <div className="glass-card p-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20">
              <p className="text-xs font-bold text-primary-700 dark:text-primary-300 mb-1">
                🎓 Student Portal
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manage your academic projects efficiently
              </p>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
