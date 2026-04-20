const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authenticateToken');
const requireAdmin = require('../middleware/requireAdmin');

const Task = require('../models/Task');
const User = require('../models/User');

router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/tasks', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

module.exports = router;
