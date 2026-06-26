import { motion } from 'framer-motion';
import { HiTrash, HiX } from 'react-icons/hi';

const DeleteConfirm = ({ task, onConfirm, onCancel, loading = false }) => {
  if (!task) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-5"
      id="delete-confirm-dialog"
    >
      {/* Warning icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <HiTrash className="w-8 h-8 text-red-500" />
        </div>
      </div>

      {/* Content */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Delete this task?
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          You are about to permanently delete{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            &ldquo;{task.title}&rdquo;
          </span>
          . This action cannot be undone.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          id="delete-cancel-btn"
          disabled={loading}
          className="btn-secondary flex-1"
        >
          <HiX className="w-4 h-4" />
          Keep Task
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onConfirm}
          id="delete-confirm-btn"
          disabled={loading}
          className="btn-danger flex-1"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Deleting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <HiTrash className="w-4 h-4" />
              Delete Forever
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default DeleteConfirm;
