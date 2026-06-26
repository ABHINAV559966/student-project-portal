import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSave, HiX } from 'react-icons/hi';

const initialState = { title: '', description: '', status: 'pending' };

const TaskForm = ({ task, onSubmit, onCancel, loading = false }) => {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  const isEditing = Boolean(task);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
      });
    } else {
      setForm(initialState);
    }
    setErrors({});
  }, [task]);

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (form.title.trim().length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }
    if (form.description && form.description.length > 1000) {
      newErrors.description = 'Description cannot exceed 1000 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-5"
      noValidate
      id={isEditing ? 'edit-task-form' : 'create-task-form'}
    >
      {/* Title */}
      <div>
        <label htmlFor="task-title" className="form-label">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Enter a clear, descriptive title..."
          className={`form-input ${errors.title ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
          maxLength={100}
          autoFocus={!isEditing}
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span>⚠️</span> {errors.title}
          </p>
        )}
        <p className="mt-1 text-xs text-slate-400 text-right">{form.title.length}/100</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="task-description" className="form-label">
          Description
          <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
        </label>
        <textarea
          id="task-description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the task in detail..."
          rows={4}
          className={`form-input resize-none ${errors.description ? 'border-red-400 dark:border-red-500 focus:ring-red-400' : ''}`}
          maxLength={1000}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <span>⚠️</span> {errors.description}
          </p>
        )}
        <p className="mt-1 text-xs text-slate-400 text-right">{form.description.length}/1000</p>
      </div>

      {/* Status */}
      <div>
        <label htmlFor="task-status" className="form-label">
          Status
        </label>
        <select
          id="task-status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className="form-input cursor-pointer"
        >
          <option value="pending">⏳ Pending</option>
          <option value="in-progress">🔄 In Progress</option>
          <option value="completed">✅ Completed</option>
        </select>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          id={isEditing ? 'submit-edit-task-btn' : 'submit-create-task-btn'}
          className="btn-primary flex-1"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <HiSave className="w-4 h-4" />
              {isEditing ? 'Update Task' : 'Create Task'}
            </span>
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={onCancel}
          id="cancel-task-btn"
          className="btn-secondary px-6"
        >
          <HiX className="w-4 h-4" />
          Cancel
        </motion.button>
      </div>
    </motion.form>
  );
};

export default TaskForm;
