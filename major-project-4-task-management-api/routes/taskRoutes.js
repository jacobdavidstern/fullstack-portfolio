const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const Task = require('../models/Task');

// GET
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userTasks = await Task.find({ userId: req.user.userId });
    res.json(userTasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST
router.post('/', authenticateToken, async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title || !description || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const validStatuses = ['todo', 'in-progress', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  if (!title || title.length < 3 || title.length > 100) {
    return res.status(400).json({ error: 'Title must be 3-100 characters' });
  }

  if (!description || description.length < 10) {
    return res
      .status(400)
      .json({ error: 'Description must be at least 10 characters' });
  }

  try {
    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: req.user.userId,
    });

    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);

    if (err.name === 'ValidationError') {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    // 1. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // 2. Ownership check
    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // 3. Validate status if provided
    const { title, description, status, priority, dueDate } = req.body;

    if (status) {
      const validStatuses = ['todo', 'in-progress', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
    }

    // 4. Apply updates only if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) {
      task.dueDate = dueDate ? new Date(dueDate) : null;
    }

    task.updatedAt = new Date();

    // 5. Save the updated task
    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.id;

    // 1. Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // 2. Verify ownership
    if (task.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // 3. Delete the task
    await Task.findByIdAndDelete(taskId);

    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
