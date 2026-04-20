const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/User');

const router = express.Router();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Basic validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if email or username already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(409).json({ error: 'User already exists' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  // prettier-ignore
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  if (username.length < 3 || username.length > 20) {
    return res.status(400).json({ error: 'Username must be 3-20 characters' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
    role: 'user',
  });

  // Create JWT
  const token = jwt.sign(
    { userId: newUser._id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.status(201).json({
    message: 'User registered successfully',
    token,
    user: { id: newUser.id, username, email, role: newUser.role },
  });
});

// POST /login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /me (protected)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
