const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');
const departmentRoutes = require('./departmentRoutes');
const eventRoutes = require('./eventRoutes');
const schoolRoutes = require('./schoolRoutes');
const userRoutes = require('./userRoutes');
const venueRoutes = require('./venueRoutes');

router.use('/auth', authRoutes);

// Specific routes FIRST
router.use('/', userRoutes);
router.use('/', eventRoutes);
router.use('/', departmentRoutes);
router.use('/', schoolRoutes);
router.use('/', venueRoutes);

// Catch-all slug route LAST
router.use('/', clientRoutes);

// Log route load order at startup
console.log('ROUTE ORDER LOADED');

module.exports = router;
