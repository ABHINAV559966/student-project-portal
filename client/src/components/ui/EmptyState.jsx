import { motion } from 'framer-motion';

const EmptyState = ({ onCreateTask }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-24 px-8 text-center"
    >
      {/* Animated clipboard icon */}
      <motion.div
        animate={{ y: [-4, 4, -4] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="mb-6"
      >
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/30 dark:to-accent-900/30 flex items-center justify-center shadow-lg">
          <span className="text-6xl" role="img" aria-label="clipboard">
            📋
          </span>
        </div>
      </motion.div>

      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
        No Tasks Found
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 leading-relaxed">
        Your task list is empty. Create your first task to start managing your projects like a pro.
      </p>

      {onCreateTask && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCreateTask}
          id="empty-state-create-btn"
          className="btn-primary text-base px-8 py-3"
        >
          <span>+</span>
          Create Your First Task
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
