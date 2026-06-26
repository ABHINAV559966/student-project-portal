const { validationResult } = require('express-validator');
const Task = require('../models/Task');
const { isUsingInMemory, inMemoryStore } = require('../config/db');
const { AppError } = require('../middleware/errorHandler');

// Helper: check validation errors
const checkValidation = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    throw new AppError(messages, 400);
  }
};

// @desc    Get all tasks (with search, filter, sort)
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res, next) => {
  try {
    const { search = '', status = '', sortBy = 'newest' } = req.query;

    if (isUsingInMemory()) {
      const tasks = inMemoryStore.findTasks({ search, status, sortBy });
      return res.status(200).json({ success: true, count: tasks.length, data: tasks });
    }

    // MongoDB query
    const filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

    const tasks = await Task.find(filter).sort(sortOrder);

    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isUsingInMemory()) {
      const task = inMemoryStore.findById(id);
      if (!task) throw new AppError('Task not found', 404);
      return res.status(200).json({ success: true, data: task });
    }

    const task = await Task.findById(id);
    if (!task) throw new AppError('Task not found', 404);

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res, next) => {
  try {
    checkValidation(req);

    const { title, description, status } = req.body;

    if (isUsingInMemory()) {
      const task = inMemoryStore.createTask({ title, description, status });
      return res.status(201).json({ success: true, data: task, message: 'Task created successfully' });
    }

    const task = await Task.create({ title, description, status });

    res.status(201).json({ success: true, data: task, message: 'Task created successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res, next) => {
  try {
    checkValidation(req);

    const { id } = req.params;
    const { title, description, status } = req.body;

    if (isUsingInMemory()) {
      const task = inMemoryStore.updateTask(id, { title, description, status });
      if (!task) throw new AppError('Task not found', 404);
      return res.status(200).json({ success: true, data: task, message: 'Task updated successfully' });
    }

    const task = await Task.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!task) throw new AppError('Task not found', 404);

    res.status(200).json({ success: true, data: task, message: 'Task updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isUsingInMemory()) {
      const task = inMemoryStore.deleteTask(id);
      if (!task) throw new AppError('Task not found', 404);
      return res.status(200).json({ success: true, message: 'Task deleted successfully' });
    }

    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new AppError('Task not found', 404);

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getTasks, getTaskById, createTask, updateTask, deleteTask };
