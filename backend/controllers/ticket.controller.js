const fs = require('fs');
const Ticket = require('../models/Ticket.model');
const { generateTicketNumber } = require('../utils/ticketNumber.util');
const { sendEmail, ticketCreatedTemplate } = require('../utils/email.util');
const { createAuditEntry } = require('../utils/auditLog.util');
const { sendSuccess, sendError } = require('../utils/apiResponse.util');

// ─── POST /api/v1/tickets ──────────────────────────────────────────────────────
const createTicket = async (req, res, next) => {
  const uploadedFilePath = req.file?.path || null;

  try {
    const { customerName, email, phone, resiNumber, category, description } = req.body;

    // Manual validation
    const errors = [];
    if (!customerName?.trim()) errors.push('customerName is required');
    if (!email?.trim()) errors.push('email is required');
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('email format is invalid');
    if (!phone?.trim()) errors.push('phone is required');
    if (!category) errors.push('category is required');
    if (!description?.trim()) errors.push('description is required');
    else if (description.trim().length < 20)
      errors.push('description must be at least 20 characters');

    if (errors.length > 0) {
      // Clean up uploaded file if validation fails
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        fs.unlinkSync(uploadedFilePath);
      }
      return sendError(res, errors.join('. '), 400);
    }

    const ticketNumber = await generateTicketNumber();

    const attachmentData = req.file
      ? {
          filename: req.file.originalname,
          filepath: `/uploads/${req.file.filename}`,
          mimetype: req.file.mimetype,
          filesize: req.file.size,
        }
      : null;

    const firstAuditEntry = createAuditEntry({
      action: 'CREATED',
      oldValue: null,
      newValue: { status: 'OPEN', category: category.trim(), customerName: customerName.trim() },
      performedBy: null, // public action — no user
    });

    const ticket = await Ticket.create({
      ticketNumber,
      customerName: customerName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      resiNumber: resiNumber?.trim() || null,
      category,
      description: description.trim(),
      attachment: attachmentData,
      auditLog: [firstAuditEntry],
    });

    // Send email — non-blocking, don't let email failure affect response
    sendEmail(ticketCreatedTemplate(ticket)).catch((err) =>
      console.error('📧 Email error (non-fatal):', err.message)
    );

    return sendSuccess(
      res,
      {
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
      'Ticket created successfully. Check your email for confirmation.',
      201
    );
  } catch (error) {
    // Clean up uploaded file on DB error
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      fs.unlink(uploadedFilePath, () => {});
    }
    next(error);
  }
};

// ─── GET /api/v1/tickets/track/:ticketNumber ───────────────────────────────────
const trackTicket = async (req, res, next) => {
  try {
    const { ticketNumber } = req.params;

    if (!ticketNumber?.trim()) {
      return sendError(res, 'Ticket number is required.', 400);
    }

    const ticket = await Ticket.findOne({
      ticketNumber: ticketNumber.trim().toUpperCase(),
    })
      .populate('handledBy', 'fullname username')
      .populate('auditLog.performedBy', 'fullname username')
      .lean();

    if (!ticket) {
      return sendError(
        res,
        'Ticket not found. Please verify your ticket number and try again.',
        404
      );
    }

    // Return only safe fields — no internal IDs or sensitive data
    const safeTicket = {
      ticketNumber: ticket.ticketNumber,
      customerName: ticket.customerName,
      category: ticket.category,
      description: ticket.description,
      status: ticket.status,
      adminResponse: ticket.adminResponse,
      handledBy: ticket.handledBy
        ? { fullname: ticket.handledBy.fullname, username: ticket.handledBy.username }
        : null,
      isArchived: ticket.isArchived,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      auditLog: (ticket.auditLog || []).map((log) => ({
        action: log.action,
        oldValue: log.oldValue,
        newValue: log.newValue,
        performedBy: log.performedBy
          ? { fullname: log.performedBy.fullname }
          : null,
        performedAt: log.performedAt,
      })),
    };

    return sendSuccess(res, { ticket: safeTicket }, 'Ticket found.');
  } catch (error) {
    next(error);
  }
};

module.exports = { createTicket, trackTicket };
