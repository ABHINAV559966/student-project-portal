import { motion } from 'framer-motion';

const StatCard = ({ title, count, icon, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-6 cursor-default relative overflow-hidden group"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: gradient, opacity: 0.05 }}
      />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            {title}
          </p>
          <motion.p
            key={count}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-4xl font-black text-slate-900 dark:text-white"
          >
            {count}
          </motion.p>
        </div>

        {/* Icon container */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0"
          style={{ background: gradient }}
        >
          {icon}
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className="absolute bottom-0 left-0 h-1 w-full rounded-b-2xl opacity-60"
        style={{ background: gradient }}
      />
    </motion.div>
  );
};

export default StatCard;
