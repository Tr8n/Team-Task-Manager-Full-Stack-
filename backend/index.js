const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
require('./connection/db');
const { User } = require('./models/userModel');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const linkRoutes = require('./routes/linkroutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for local development
// 
app.use(cors({
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
    "https://link-up-gules.vercel.app",
    "https://link-up-git-main-tr8ns-projects.vercel.app"
  ],
  credentials: true
}));

app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Team Task Manager API is running');
});

const ensureDefaultAdmin = async () => {
  const email = (process.env.ADMIN_EMAIL || 'admin@linkup.local').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';
  const name = (process.env.ADMIN_NAME || 'System Admin').trim();

  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) return;

  const adminUser = new User({
    name,
    email,
    password,
    role: 'ADMIN'
  });
  await adminUser.save();
  console.log(`Default admin created: ${email}`);
};

mongoose.connection.once('open', async () => {
  try {
    await ensureDefaultAdmin();
  } catch (error) {
    console.error('Failed to ensure default admin:', error.message);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});