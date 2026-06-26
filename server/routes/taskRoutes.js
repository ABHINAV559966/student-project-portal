const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { taskValidationRules, taskUpdateValidationRules } = require('../middleware/validate');

// GET  /api/tasks        - Get all tasks (with search, filter, sort)
// POST /api/tasks        - Create a new task
router.route('/').get(getTasks).post(taskValidationRules, createTask);

// GET    /api/tasks/:id  - Get single task
// PUT    /api/tasks/:id  - Update task
// DELETE /api/tasks/:id  - Delete task
router
  .route('/:id')
  .get(getTaskById)
  .put(taskUpdateValidationRules, updateTask)
  .delete(deleteTask);

module.exports = router;
