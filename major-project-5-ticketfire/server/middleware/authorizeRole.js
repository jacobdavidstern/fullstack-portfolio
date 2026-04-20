const authorizeRole = (...roles) => {
  return (req, res, next) => {
    // Platform admins bypass tenant restriction
    if (req.user.isPlatformAdmin) return next();

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};

module.exports = { authorizeRole };
