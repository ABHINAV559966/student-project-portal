import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import taskService from '../api/taskService';

const useTasks = (initialParams = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    search: '',
    status: '',
    sortBy: 'newest',
    ...initialParams,
  });

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getAllTasks(params);
      setTasks(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Create task
  const createTask = async (taskData) => {
    try {
      const response = await taskService.createTask(taskData);
      toast.success('Task created successfully! 🎉');
      fetchTasks();
      return { success: true, data: response.data };
    } catch (err) {
      toast.error(err.message || 'Failed to create task');
      return { success: false, error: err.message };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      const response = await taskService.updateTask(id, taskData);
      toast.success('Task updated successfully! ✅');
      fetchTasks();
      return { success: true, data: response.data };
    } catch (err) {
      toast.error(err.message || 'Failed to update task');
      return { success: false, error: err.message };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await taskService.deleteTask(id);
      toast.success('Task deleted successfully');
      fetchTasks();
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Failed to delete task');
      return { success: false, error: err.message };
    }
  };

  // Update search/filter/sort params
  const updateParams = useCallback((newParams) => {
    setParams((prev) => ({ ...prev, ...newParams }));
  }, []);

  return {
    tasks,
    loading,
    error,
    params,
    updateParams,
    createTask,
    updateTask,
    deleteTask,
    refetch: fetchTasks,
  };
};

export default useTasks;
