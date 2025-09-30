// middleware/roles.js

// Factory function: checks if user role is allowed
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

// ✅ export only the function
module.exports = allowRoles;
