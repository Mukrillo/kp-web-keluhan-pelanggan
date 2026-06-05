const express = require('express');
const { login, logout, getMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/v1/auth/login
router.post('/login', login);

// POST /api/v1/auth/logout  (requires valid session to logout)
router.post('/logout', protect, logout);

// GET /api/v1/auth/me
router.get('/me', protect, getMe);

module.exports = router;
