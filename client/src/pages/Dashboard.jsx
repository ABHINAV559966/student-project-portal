import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { HiClipboardList, HiClock, HiLightningBolt, HiCheckCircle, HiPlus } from 'react-icons/hi';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import Spinner from '../components/ui/Spinner';
import taskService from '../api/taskService';

const CHART_COLORS = {
  pending: '#f59e0b',
  'in-progress': '#3b82f6',
  completed: '#10b981',
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [statsRes, tasksRes] = await Promise.all([
          taskService.getDashboardStats(),
          taskService.getAllTasks({ sortBy: 'newest' }),
        ]);
        setStats(statsRes.data);
        setRecentTasks((tasksRes.data || []).slice(0, 5));
      } catch (err) {
        console.error('Dashboard fetch error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      title: 'Total Tasks',
      count: stats?.total ?? 0,
      icon: '📋',
      gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      delay: 0,
    },
    {
      title: 'Pending',
      count: stats?.pending ?? 0,
      icon: '⏳',
      gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
      delay: 0.1,
    },
    {
      title: 'In Progress',
      count: stats?.inProgress ?? 0,
      icon: '🔄',
      gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
      delay: 0.2,
    },
    {
      title: 'Completed',
      count: stats?.completed ?? 0,
      icon: '✅',
      gradient: 'linear-gradient(135deg, #10b981, #059669)',
      delay: 0.3,
    },
  ];

  const pieData = stats
    ? [
        { name: 'Pending', value: stats.pending, color: CHART_COLORS.pending },
        { name: 'In Progress', value: stats.inProgress, color: CHART_COLORS['in-progress'] },
        { name: 'Completed', value: stats.completed, color: CHART_COLORS.completed },
      ].filter((d) => d.value > 0)
    : [];

  const statusBadge = (status) => {
    const map = {
      pending: 'badge badge-pending',
      'in-progress': 'badge badge-in-progress',
      completed: 'badge badge-completed',
    };
    const labels = { pending: 'Pending', 'in-progress': 'In Progress', completed: 'Completed' };
    return <span className={map[status] || 'badge'}>{labels[status] || status}</span>;
  };

  if (loading) {
    return <Spinner size="lg" label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-heading gradient-text">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Welcome back! Here's your project overview.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/tasks')}
          id="dashboard-create-task-btn"
          className="btn-primary"
        >
          <HiPlus className="w-5 h-5" />
          New Task
        </motion.button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* Chart + Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <HiLightningBolt className="w-5 h-5 text-primary-500" />
            Task Distribution
          </h2>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(15,23,42,0.9)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 dark:text-slate-500">
              <div className="text-center">
                <div className="text-5xl mb-3">📊</div>
                <p className="text-sm">No tasks yet to chart</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HiClipboardList className="w-5 h-5 text-primary-500" />
              Recent Tasks
            </h2>
            <Link
              to="/tasks"
              className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
              id="dashboard-view-all-link"
            >
              View All →
            </Link>
          </div>

          {recentTasks.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm">No tasks yet</p>
              <Link to="/tasks" className="text-primary-500 text-sm font-medium hover:underline mt-2 block">
                Create your first task
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task, i) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.07 }}
                >
                  <Link
                    to={`/tasks/${task._id}`}
                    id={`recent-task-${task._id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0 bg-primary-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {task.title}
                      </span>
                    </div>
                    {statusBadge(task.status)}
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="glass-card p-6"
      >
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <HiCheckCircle className="w-5 h-5 text-emerald-500" />
          Progress Overview
        </h2>
        <div className="space-y-3">
          {stats && stats.total > 0 ? (
            <>
              {[
                { label: 'Pending', value: stats.pending, color: 'bg-amber-400', total: stats.total },
                { label: 'In Progress', value: stats.inProgress, color: 'bg-blue-500', total: stats.total },
                { label: 'Completed', value: stats.completed, color: 'bg-emerald-500', total: stats.total },
              ].map((item) => {
                const pct = stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0;
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 w-24 flex-shrink-0">
                      {item.label}
                    </span>
                    <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, delay: 0.7, ease: 'easeOut' }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 w-12 text-right">
                      {pct}%
                    </span>
                  </div>
                );
              })}
            </>
          ) : (
            <p className="text-slate-400 dark:text-slate-500 text-sm text-center py-4">
              No data available. Create tasks to see progress.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
