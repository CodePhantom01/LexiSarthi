const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({
        message: 'Admin access only'
      });
    }
    next();
  };
  
  module.exports = adminMiddleware;