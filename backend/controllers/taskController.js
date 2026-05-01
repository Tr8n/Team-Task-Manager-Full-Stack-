const mongoose = require('mongoose');
const Task = require('../models/taskModel');
const Project = require('../models/projectModel');
const { User } = require('../models/userModel');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate } = req.body;
    if (!title || !projectId || !assignedTo) {
      return res.status(400).json({ message: 'title, projectId and assignedTo are required' });
    }
    if (!isValidObjectId(projectId) || !isValidObjectId(assignedTo)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const assignee = await User.findById(assignedTo);
    if (!assignee) return res.status(404).json({ message: 'Assignee not found' });

    const requesterIsMember = project.members.some((memberId) => String(memberId) === String(req.user._id));
    if (!requesterIsMember && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only project members/admin can create tasks' });
    }

    const assigneeIsMember = project.members.some((memberId) => String(memberId) === String(assignedTo));
    if (!assigneeIsMember) {
      return res.status(400).json({ message: 'Assignee must be a project member' });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo,
      dueDate,
      createdBy: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task', error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    const query = {};

    if (projectId && isValidObjectId(projectId)) query.project = projectId;
    if (status) query.status = status;

    if (req.user.role !== 'ADMIN') {
      query.$or = [{ assignedTo: req.user._id }, { createdBy: req.user._id }];
    }

    const tasks = await Task.find(query)
      .populate('project', 'name')
      .populate('assignedTo', 'name email role')
      .populate('createdBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!isValidObjectId(id)) return res.status(400).json({ message: 'Invalid id' });
    if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const canUpdate =
      req.user.role === 'ADMIN' ||
      String(task.assignedTo) === String(req.user._id) ||
      String(task.createdBy) === String(req.user._id);

    if (!canUpdate) return res.status(403).json({ message: 'Not allowed' });

    task.status = status;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task status', error: error.message });
  }
};

module.exports = { createTask, getTasks, updateTaskStatus };
