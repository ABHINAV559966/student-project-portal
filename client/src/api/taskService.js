import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ─── Request Interceptor ──────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Add any auth tokens here if needed in future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ─────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

// ─── Task API Service ─────────────────────────────────────────────────────

const taskService = {
  // Get all tasks with optional query params
  getAllTasks: (params = {}) => {
    return api.get('/tasks', { params });
  },

  // Get single task by ID
  getTaskById: (id) => {
    return api.get(`/tasks/${id}`);
  },

  // Create a new task
  createTask: (taskData) => {
    return api.post('/tasks', taskData);
  },

  // Update an existing task
  updateTask: (id, taskData) => {
    return api.put(`/tasks/${id}`, taskData);
  },

  // Delete a task
  deleteTask: (id) => {
    return api.delete(`/tasks/${id}`);
  },

  // Get dashboard statistics
  getDashboardStats: () => {
    return api.get('/dashboard/stats');
  },
};

export default taskService;
