import { motion } from 'framer-motion';
import { HiPencil, HiTrash, HiClock, HiCalendar, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';

const statusConfig = {
  pending: {
    badge: 'badge badge-pending',
    icon: <HiExclamationCircle className="w-3.5 h-3.5" />,
    label: 'Pending',
    dot: 'bg-amber-400',
  },
  'in-progress': {
    badge: 'badge badge-in-progress',
    icon: <HiClock className="w-3.5 h-3.5" />,
    label: 'In Progress',
    dot: 'bg-blue-400',
  },
  completed: {
    badge: 'badge badge-completed',
    icon: <HiCheckCircle className="w-3.5 h-3.5" />,
    label: 'Completed',
    dot: 'bg-emerald-400',
  },
};

const formatDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const TaskCard = ({ task, onEdit, onDelete, index = 0 }) => {
  const config = statusConfig[task.status] || statusConfig.pending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="glass-card p-5 flex flex-col gap-3 group hover:shadow-xl transition-shadow duration-300"
    >
      {/* Header: Status + Actions */}
      <div className="flex items-start justify-between gap-2">
        <span className={config.badge}>
          {config.icon}
          {config.label}
        </span>

        {/* Action buttons (appear on hover) */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onEdit(task)}
            id={`edit-task-${task._id}`}
            title="Edit task"
            className="p-2 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
            aria-label={`Edit task: ${task.title}`}
          >
            <HiPencil className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(task)}
            id={`delete-task-${task._id}`}
            title="Delete task"
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            aria-label={`Delete task: ${task.title}`}
          >
            <HiTrash className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Title */}
      <Link to={`/tasks/${task._id}`} className="block group/title">
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover/title:text-primary-600 dark:group-hover/title:text-primary-400 transition-colors line-clamp-2">
          {task.title}
        </h3>
      </Link>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer: Dates */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <HiCalendar className="w-3.5 h-3.5" />
          <span>Created {formatDate(task.createdAt)}</span>
        </div>
        {task.updatedAt !== task.createdAt && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <HiClock className="w-3.5 h-3.5" />
            <span>Updated {formatDate(task.updatedAt)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;
