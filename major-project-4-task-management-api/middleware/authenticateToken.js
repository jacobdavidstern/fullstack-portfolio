const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Expecting: "Bearer <token>"
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }
  // Extract the token from "Bearer Token" format
  const token = authHeader.split(' ')[1]; // get the token part
  // Check if token was provided
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }
  // Verify the token using the secret key stored in .env
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded user info to request
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

module.exports = authenticateToken;
