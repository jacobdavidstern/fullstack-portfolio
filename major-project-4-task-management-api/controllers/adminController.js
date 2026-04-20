const Post = require('../models/Post');
const User = require('../models/User');

// Get all users (admin only)
function getAllUsers(req, res) {
  const users = User.getAll().map((user) => User.getSafeUser(user));
  res.json({ count: users.length, users });
}

// Update user role (admin only)
function updateUserRole(req, res) {
  const userId = parseInt(req.params.userId);
  const { role } = req.body;

  const validRoles = ['user', 'moderator', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const updatedUser = User.updateRole(userId, role);
  if (!updatedUser) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    message: 'User role updated',
    user: User.getSafeUser(updatedUser),
  });
}

// Delete user (admin only)
function deleteUser(req, res) {
  const userId = parseInt(req.params.userId);

  // Prevent self-deletion
  if (userId === req.user.userId) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  const deleted = User.deleteById(userId);
  if (!deleted) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({ message: 'User deleted' });
}

// Get statistics (admin only)
function getStats(req, res) {
  const userCount = User.getAll().length;
  const postCount = Post.getAll().length;
  const adminCount = User.countByRole('admin');
  const modCount = User.countByRole('moderator');

  res.json({
    users: { total: userCount, admins: adminCount, moderators: modCount },
    posts: { total: postCount },
  });
}

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getStats,
};
