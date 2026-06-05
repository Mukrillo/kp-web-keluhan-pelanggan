const express = require('express');
const { createTicket, trackTicket } = require('../controllers/ticket.controller');
const upload = require('../middleware/upload.middleware');

const router = express.Router();

// POST /api/v1/tickets  — Public ticket submission with optional file attachment
router.post('/', upload.single('attachment'), createTicket);

// GET /api/v1/tickets/track/:ticketNumber  — Public ticket tracking
router.get('/track/:ticketNumber', trackTicket);

module.exports = router;
