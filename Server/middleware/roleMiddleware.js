export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};

export const isAdmin = requireRole('admin');
export const isEmployee = requireRole('employee');
export const isAdminOrEmployee = requireRole('admin', 'employee');