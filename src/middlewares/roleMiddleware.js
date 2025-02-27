module.exports = (role) => {
    return (req, res, next) => {
      if (req.user.role !== role && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. You do not have permission.' });
      }
      next();
    };
  };
  