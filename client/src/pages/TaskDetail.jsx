import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  HiArrowLeft,
  HiPencil,
  HiTrash,
  HiCalendar,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
} from 'react-icons/hi';
import taskService from '../api/taskService';
import Spinner from '../components/ui/Spinner';
import TaskModal from '../components/tasks/TaskModal';
import TaskForm from '../components/tasks/TaskForm';
import DeleteConfirm from '../components/tasks/DeleteConfirm';

const statusConfig = {
  pending: {
    badge: 'badge badge-pending',
    icon: <HiExclamationCircle className="w-4 h-4" />,
    label: 'Pending',
    gradient: 'from-amber-500 to-orange-400',
  },
  'in-progress': {
    badge: 'badge badge-in-progress',
    icon: <HiClock className="w-4 h-4" />,
    label: 'In Progress',
    gradient: 'from-blue-500 to-indigo-400',
  },
  completed: {
    badge: 'badge badge-completed',
    icon: <HiCheckCircle className="w-4 h-4" />,
    label: 'Completed',
    gradient: 'from-emerald-500 to-teal-400',
  },
};

const formatFullDate = (dateString) => {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await taskService.getTaskById(id);
        setTask(response.data);
      } catch (err) {
        if (err.message.includes('not found') || err.message.includes('404')) {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleUpdate = async (formData) => {
    setFormLoading(true);
    try {
      const response = await taskService.updateTask(id, formData);
      setTask(response.data);
      setIsEditOpen(false);
      toast.success('Task updated successfully! ✅');
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted');
      navigate('/tasks');
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
      setDeleteLoading(false);
      setIsDeleteOpen(false);
    }
  };

  if (loading) return <Spinner size="lg" label="Loading task..." />;

  if (notFound || !task) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Task Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">This task may have been deleted or doesn't exist.</p>
        <Link to="/tasks" className="btn-primary" id="task-detail-back-link">
          <HiArrowLeft className="w-4 h-4" /> Back to Tasks
        </Link>
      </div>
    );
  }

  const config = statusConfig[task.status] || statusConfig.pending;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      {/* Back link */}
      <Link
        to="/tasks"
        id="back-to-tasks-link"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to Tasks
      </Link>

      {/* Task Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card overflow-hidden"
      >
        {/* Gradient header bar */}
        <div className={`h-2 w-full bg-gradient-to-r ${config.gradient}`} />

        <div className="p-8">
          {/* Status + Actions */}
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <span className={`${config.badge} text-sm px-4 py-1.5`}>
              {config.icon}
              {config.label}
            </span>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditOpen(true)}
                id="task-detail-edit-btn"
                className="btn-secondary text-sm px-4 py-2"
              >
                <HiPencil className="w-4 h-4" />
                Edit
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsDeleteOpen(true)}
                id="task-detail-delete-btn"
                className="btn-danger text-sm px-4 py-2"
              >
                <HiTrash className="w-4 h-4" />
                Delete
              </motion.button>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
            {task.title}
          </h1>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
              Description
            </h3>
            {task.description ? (
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 italic">No description provided.</p>
            )}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-700/50">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                <HiCalendar className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Created
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                  {formatFullDate(task.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent-50 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0">
                <HiClock className="w-5 h-5 text-accent-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Last Updated
                </p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-0.5">
                  {formatFullDate(task.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Modal */}
      <TaskModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="✏️ Edit Task">
        <TaskForm
          task={task}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditOpen(false)}
          loading={formLoading}
        />
      </TaskModal>

      {/* Delete Modal */}
      <TaskModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="🗑️ Delete Task">
        <DeleteConfirm
          task={task}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteOpen(false)}
          loading={deleteLoading}
        />
      </TaskModal>
    </div>
  );
};

export default TaskDetail;
