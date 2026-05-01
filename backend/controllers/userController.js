const { User } = require('../models/userModel');

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const normalizedName = String(name || '').trim();
    if (!normalizedName || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = new User({
      name: normalizedName,
      email: normalizedEmail,
      password,
      role: role === 'ADMIN' ? 'ADMIN' : 'MEMBER'
    });
    await user.save();
    const token = user.generateJWT();
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Signup failed', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = user.generateJWT();
    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

module.exports = { signup, login, getUsers };