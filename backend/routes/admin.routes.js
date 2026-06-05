const express = require('express');
const {
  getDashboard,
  getTickets,
  getTicketById,
  updateTicket,
  bulkArchive,
  bulkRestore,
} = require('../controllers/admin.controller');
const { protect, checkRole } = require('../middleware/auth.middleware');

const router = express.Router();

// All routes below require: valid JWT cookie + admin role
router.use(protect);
router.use(checkRole('admin'));

// GET /api/v1/admin/dashboard
router.get('/dashboard', getDashboard);

// GET /api/v1/admin/tickets?page=&limit=&search=&status=&archived=&sortBy=&sortOrder=
router.get('/tickets', getTickets);

// POST /api/v1/admin/tickets/bulk-archive
// NOTE: Must be defined BEFORE /:id to avoid route collision
router.post('/tickets/bulk-archive', bulkArchive);

// POST /api/v1/admin/tickets/bulk-restore
router.post('/tickets/bulk-restore', bulkRestore);

// GET /api/v1/admin/tickets/:id
router.get('/tickets/:id', getTicketById);

// PUT /api/v1/admin/tickets/:id
router.put('/tickets/:id', updateTicket);

module.exports = router;
