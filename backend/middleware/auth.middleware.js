const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { sendError } = require('../utils/apiResponse.util');

/**
 * protect — Verifies JWT from HttpOnly cookie
 * Attaches req.user if valid
 */
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return sendError(res, 'Authentication required. Please log in.', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendError(res, 'User no longer exists.', 401);
    }

    if (!user.isActive) {
      return sendError(res, 'Your account has been disabled. Contact support.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Session expired. Please log in again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      return sendError(res, 'Invalid authentication token.', 401);
    }
    next(error);
  }
};

/**
 * checkRole — RBAC middleware factory
 * Usage: checkRole('admin') or checkRole('admin', 'superadmin')
 * Siapkan untuk roadmap multi-role
 */
const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(
        res,
        `Access denied. This action requires role(s): ${roles.join(', ')}.`,
        403
      );
    }

    next();
  };
};

module.exports = { protect, checkRole };
