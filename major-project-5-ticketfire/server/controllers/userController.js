const Client = require('../models/Client');
const User = require('../models/User');

// POST /api/:clientId/users
// Create a new user for a specific client (owner-only)
exports.createUser = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: 'Email, password, and role are required.' });
    }

    // Ensure the client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found.' });
    }

    // Ensure the logged-in owner belongs to this client
    if (req.user.client.toString() !== clientId.toString()) {
      return res
        .status(403)
        .json({ message: 'Not authorized to create users for this client.' });
    }

    // Prevent duplicate emails
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(409)
        .json({ message: 'A user with this email already exists.' });
    }

    // Create the user
    const newUser = await User.create({
      email,
      password,
      role,
      client: clientId,
    });

    res.status(201).json({
      message: 'User created successfully.',
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
        client: newUser.client,
      },
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({
      message: 'Failed to create user.',
      error: err.message,
    });
  }
};
