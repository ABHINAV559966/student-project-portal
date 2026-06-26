import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiFilter, HiSortAscending, HiSortDescending } from 'react-icons/hi';
import useTasks from '../hooks/useTasks';
import TaskCard from '../components/tasks/TaskCard';
import TaskModal from '../components/tasks/TaskModal';
import TaskForm from '../components/tasks/TaskForm';
import DeleteConfirm from '../components/tasks/DeleteConfirm';
import SearchBar from '../components/ui/SearchBar';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

const FILTERS = [
  { label: 'All', value: '' },
  { label: '⏳ Pending', value: 'pending' },
  { label: '🔄 In Progress', value: 'in-progress' },
  { label: '✅ Completed', value: 'completed' },
];

const Tasks = () => {
  const { tasks, loading, params, updateParams, createTask, updateTask, deleteTask } = useTasks();

  const [searchInput, setSearchInput] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams({ search: searchInput });
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, updateParams]);

  const handleCreate = useCallback(async (formData) => {
    setFormLoading(true);
    const result = await createTask(formData);
    setFormLoading(false);
    if (result.success) setIsCreateOpen(false);
  }, [createTask]);

  const handleUpdate = useCallback(async (formData) => {
    if (!editingTask) return;
    setFormLoading(true);
    const result = await updateTask(editingTask._id, formData);
    setFormLoading(false);
    if (result.success) setEditingTask(null);
  }, [editingTask, updateTask]);

  const handleDelete = useCallback(async () => {
    if (!deletingTask) return;
    setDeleteLoading(true);
    const result = await deleteTask(deletingTask._id);
    setDeleteLoading(false);
    if (result.success) setDeletingTask(null);
  }, [deletingTask, deleteTask]);

  return (
    <div className="space-y-6 animate-in">
      {/* Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-heading gradient-text">All Tasks</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {loading ? 'Loading...' : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsCreateOpen(true)}
          id="create-task-btn"
          className="btn-primary"
        >
          <HiPlus className="w-5 h-5" />
          New Task
        </motion.button>
      </div>

      {/* Search + Filters + Sort bar */}
      <div className="glass-card p-4">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search by title or description... (Ctrl+K)"
          />

          {/* Filters + Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Status filters */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <HiFilter className="w-4 h-4 text-slate-400 flex-shrink-0" />
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  id={`filter-${f.value || 'all'}`}
                  onClick={() => updateParams({ status: f.value })}
                  className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    params.status === f.value
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30 scale-105'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide hidden sm:block">
                Sort
              </span>
              <button
                id="sort-newest-btn"
                onClick={() => updateParams({ sortBy: 'newest' })}
                title="Newest first"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  params.sortBy === 'newest'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <HiSortDescending className="w-4 h-4" />
              </button>
              <button
                id="sort-oldest-btn"
                onClick={() => updateParams({ sortBy: 'oldest' })}
                title="Oldest first"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  params.sortBy === 'oldest'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <HiSortAscending className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Task Grid */}
      {loading ? (
        <Spinner size="lg" label="Fetching tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState onCreateTask={() => setIsCreateOpen(true)} />
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onEdit={(t) => setEditingTask(t)}
                onDelete={(t) => setDeletingTask(t)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Create Modal ──────────────────────────────── */}
      <TaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="✨ Create New Task"
      >
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setIsCreateOpen(false)}
          loading={formLoading}
        />
      </TaskModal>

      {/* ── Edit Modal ────────────────────────────────── */}
      <TaskModal
        isOpen={Boolean(editingTask)}
        onClose={() => setEditingTask(null)}
        title="✏️ Edit Task"
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleUpdate}
          onCancel={() => setEditingTask(null)}
          loading={formLoading}
        />
      </TaskModal>

      {/* ── Delete Confirm Modal ──────────────────────── */}
      <TaskModal
        isOpen={Boolean(deletingTask)}
        onClose={() => setDeletingTask(null)}
        title="🗑️ Delete Task"
      >
        <DeleteConfirm
          task={deletingTask}
          onConfirm={handleDelete}
          onCancel={() => setDeletingTask(null)}
          loading={deleteLoading}
        />
      </TaskModal>
    </div>
  );
};

export default Tasks;
