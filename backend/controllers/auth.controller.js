const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const { sendSuccess, sendError } = require('../utils/apiResponse.util');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  path: '/',
};

// ─── POST /api/v1/auth/login ───────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return sendError(res, 'Username and password are required.', 400);
    }

    // Allow login with username OR email
    const user = await User.findOne({
      $or: [
        { username: username.toLowerCase().trim() },
        { email: username.toLowerCase().trim() },
      ],
      isActive: true,
    }).select('+password');

    if (!user) {
      return sendError(res, 'Invalid credentials.', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials.', 401);
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.cookie('token', token, COOKIE_OPTIONS);

    return sendSuccess(res, { user: user.toJSON() }, 'Login successful.');
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/v1/auth/logout ──────────────────────────────────────────────────
const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });
    return sendSuccess(res, null, 'Logged out successfully.');
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/auth/me ───────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    return sendSuccess(res, { user: req.user }, 'User data retrieved.');
  } catch (error) {
    next(error);
  }
};

module.exports = { login, logout, getMe };
