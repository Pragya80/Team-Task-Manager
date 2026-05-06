const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const projectRoutes = require('./projects');
const taskRoutes = require('./tasks');
const teamRoutes = require('./team');
const dashboardRoutes = require('./dashboard');

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mount modular routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);

// Since tasks, team, and dashboard routes are nested under /projects/:id
// we will mount them directly to their specific paths or handle inside projects.js.
// Given the spec, we can define the full paths here.
router.use('/projects/:id/tasks', taskRoutes);
router.use('/projects/:id/members', teamRoutes);
router.use('/projects/:id/dashboard', dashboardRoutes);

module.exports = router;
