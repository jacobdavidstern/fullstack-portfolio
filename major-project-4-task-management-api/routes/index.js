const express = require('express');
const router = express.Router();

const adminRoutes = require('./adminRoutes.js');
// const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

// router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/admin', adminRoutes);

module.exports = router;


function Greeting() {
  let words;
  if(loggedIn) {
  words = "Hello, welcome back.";
  } else {
  words = "Who are you? Get away.";
  return <h1>{words}</h1>;
}
