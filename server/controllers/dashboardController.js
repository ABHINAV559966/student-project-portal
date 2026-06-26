const Task = require('../models/Task');
const { isUsingInMemory, inMemoryStore } = require('../config/db');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Public
const getDashboardStats = async (req, res, next) => {
  try {
    if (isUsingInMemory()) {
      const stats = inMemoryStore.getStats();
      return res.status(200).json({ success: true, data: stats });
    }

    // MongoDB aggregation for stats
    const stats = await Task.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = { total: 0, pending: 0, inProgress: 0, completed: 0 };

    stats.forEach(({ _id, count }) => {
      result.total += count;
      if (_id === 'pending') result.pending = count;
      if (_id === 'in-progress') result.inProgress = count;
      if (_id === 'completed') result.completed = count;
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboardStats };
