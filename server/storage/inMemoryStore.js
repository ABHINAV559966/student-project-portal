// In-Memory Storage Fallback
// Used automatically when MongoDB Atlas is unavailable
// Provides the same CRUD interface as the Mongoose models

const { v4: uuidv4 } = (() => {
  try {
    return require('crypto');
  } catch {
    return { v4: () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36) };
  }
})();

// Generate a unique ID using crypto or fallback
const generateId = () => {
  try {
    const { randomUUID } = require('crypto');
    return randomUUID();
  } catch {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
};

let tasks = [];

// Seed with sample data for demonstration
const seedData = () => {
  const now = new Date();
  tasks = [
    {
      _id: generateId(),
      title: 'Design Database Schema',
      description: 'Create and finalize the MongoDB schema for the student project portal including all required fields and relationships.',
      status: 'completed',
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
    },
    {
      _id: generateId(),
      title: 'Build REST API Endpoints',
      description: 'Implement all CRUD endpoints for task management including GET, POST, PUT, DELETE operations with proper validation.',
      status: 'in-progress',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      _id: generateId(),
      title: 'Create React Frontend',
      description: 'Build the React 19 frontend with Vite, Tailwind CSS, dark mode, animations, and a professional dashboard UI.',
      status: 'in-progress',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      _id: generateId(),
      title: 'Write Unit Tests',
      description: 'Write comprehensive unit tests for all backend controllers and frontend components to ensure reliability.',
      status: 'pending',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      _id: generateId(),
      title: 'Deploy to Production',
      description: 'Deploy the backend to Render and frontend to Vercel. Connect MongoDB Atlas and configure all environment variables.',
      status: 'pending',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  ];
};

seedData();

const inMemoryStore = {
  // Get all tasks with optional search, filter, sort
  findTasks: ({ search = '', status = '', sortBy = 'newest' } = {}) => {
    let result = [...tasks];

    // Search by title or description
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(lowerSearch) ||
          t.description.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by status
    if (status && status !== 'all') {
      result = result.filter((t) => t.status === status);
    }

    // Sort
    if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  },

  // Find task by ID
  findById: (id) => {
    return tasks.find((t) => t._id === id) || null;
  },

  // Create a new task
  createTask: ({ title, description, status = 'pending' }) => {
    const now = new Date();
    const task = {
      _id: generateId(),
      title: title.trim(),
      description: description ? description.trim() : '',
      status,
      createdAt: now,
      updatedAt: now,
    };
    tasks.unshift(task);
    return task;
  },

  // Update existing task
  updateTask: (id, { title, description, status }) => {
    const index = tasks.findIndex((t) => t._id === id);
    if (index === -1) return null;

    const updated = {
      ...tasks[index],
      ...(title !== undefined && { title: title.trim() }),
      ...(description !== undefined && { description: description.trim() }),
      ...(status !== undefined && { status }),
      updatedAt: new Date(),
    };

    tasks[index] = updated;
    return updated;
  },

  // Delete a task
  deleteTask: (id) => {
    const index = tasks.findIndex((t) => t._id === id);
    if (index === -1) return null;
    const deleted = tasks[index];
    tasks.splice(index, 1);
    return deleted;
  },

  // Get dashboard statistics
  getStats: () => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'pending').length;
    const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;

    return { total, pending, inProgress, completed };
  },
};

module.exports = inMemoryStore;
