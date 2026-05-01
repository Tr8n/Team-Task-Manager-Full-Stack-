const Task = require('../models/taskModel');
const Project = require('../models/projectModel');
const { User } = require('../models/userModel');

const getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const baseFilter = req.user.role === 'ADMIN' ? {} : { assignedTo: req.user._id };

    const [totalTasks, todo, inProgress, done, overdue] = await Promise.all([
      Task.countDocuments(baseFilter),
      Task.countDocuments({ ...baseFilter, status: 'TODO' }),
      Task.countDocuments({ ...baseFilter, status: 'IN_PROGRESS' }),
      Task.countDocuments({ ...baseFilter, status: 'DONE' }),
      Task.countDocuments({
        ...baseFilter,
        status: { $ne: 'DONE' },
        dueDate: { $lt: now }
      })
    ]);

    res.json({
      totalTasks,
      status: { TODO: todo, IN_PROGRESS: inProgress, DONE: done },
      overdue
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard', error: error.message });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const now = new Date();
    const [totalUsers, adminUsers, memberUsers, totalProjects, totalTasks, todo, inProgress, done, overdue, recentUsers, recentTasks] =
      await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ role: 'ADMIN' }),
        User.countDocuments({ role: 'MEMBER' }),
        Project.countDocuments({}),
        Task.countDocuments({}),
        Task.countDocuments({ status: 'TODO' }),
        Task.countDocuments({ status: 'IN_PROGRESS' }),
        Task.countDocuments({ status: 'DONE' }),
        Task.countDocuments({ status: { $ne: 'DONE' }, dueDate: { $lt: now } }),
        User.find({}, 'name email role createdAt').sort({ createdAt: -1 }).limit(5),
        Task.find({}, 'title status dueDate createdAt')
          .populate('project', 'name')
          .populate('assignedTo', 'name email')
          .sort({ createdAt: -1 })
          .limit(8)
      ]);

    res.json({
      users: {
        total: totalUsers,
        admin: adminUsers,
        member: memberUsers
      },
      projects: {
        total: totalProjects
      },
      tasks: {
        total: totalTasks,
        status: { TODO: todo, IN_PROGRESS: inProgress, DONE: done },
        overdue
      },
      recentUsers,
      recentTasks
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin dashboard', error: error.message });
  }
};

module.exports = { getDashboard, getAdminDashboard };
