const mongoose = require('mongoose');
const Project = require('../models/projectModel');
const { User } = require('../models/userModel');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const createProject = async (req, res) => {
  try {
    const { name, description, memberIds = [] } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name is required' });

    const validMemberIds = memberIds.filter((id) => isValidObjectId(id));
    const members = [...new Set([...validMemberIds, String(req.user._id)])];

    const project = await Project.create({
      name,
      description,
      owner: req.user._id,
      members
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create project', error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ members: req.user._id })
      .populate('owner', 'name email role')
      .populate('members', 'name email role');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch projects', error: error.message });
  }
};

const addProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    if (!isValidObjectId(id) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const userExists = await User.findById(userId);
    if (!userExists) return res.status(404).json({ message: 'User not found' });

    const project = await Project.findById(id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (String(project.owner) !== String(req.user._id) && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only owner/admin can add members' });
    }

    project.members.addToSet(userId);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add member', error: error.message });
  }
};

module.exports = { createProject, getProjects, addProjectMember };
