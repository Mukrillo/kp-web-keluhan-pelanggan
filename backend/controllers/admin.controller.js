const mongoose = require('mongoose');
const Ticket = require('../models/Ticket.model');
const { createAuditEntry } = require('../utils/auditLog.util');
const { sendEmail, statusUpdateTemplate } = require('../utils/email.util');
const { sendSuccess, sendError, sendPaginated } = require('../utils/apiResponse.util');

const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const VALID_SORT_FIELDS = ['createdAt', 'updatedAt', 'status', 'ticketNumber', 'customerName'];

// ─── GET /api/v1/admin/dashboard ──────────────────────────────────────────────
const getDashboard = async (req, res, next) => {
  try {
    const [aggregateResult, latestTickets] = await Promise.all([
      Ticket.aggregate([
        {
          $facet: {
            total: [{ $count: 'count' }],
            open: [
              { $match: { status: 'OPEN', isArchived: false } },
              { $count: 'count' },
            ],
            inProgress: [
              { $match: { status: 'IN_PROGRESS', isArchived: false } },
              { $count: 'count' },
            ],
            resolved: [
              { $match: { status: 'RESOLVED', isArchived: false } },
              { $count: 'count' },
            ],
            closed: [
              { $match: { status: 'CLOSED', isArchived: false } },
              { $count: 'count' },
            ],
            archived: [
              { $match: { isArchived: true } },
              { $count: 'count' },
            ],
          },
        },
      ]),
      Ticket.find({ isArchived: false })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('handledBy', 'fullname username')
        .lean(),
    ]);

    const facet = aggregateResult[0];
    const stats = {
      total: facet.total[0]?.count || 0,
      open: facet.open[0]?.count || 0,
      inProgress: facet.inProgress[0]?.count || 0,
      resolved: facet.resolved[0]?.count || 0,
      closed: facet.closed[0]?.count || 0,
      archived: facet.archived[0]?.count || 0,
    };

    return sendSuccess(res, { stats, latestTickets }, 'Dashboard data retrieved.');
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/admin/tickets ────────────────────────────────────────────────
const getTickets = async (req, res, next) => {
  try {
    const {
      page = '1',
      limit = '10',
      search = '',
      status = '',
      archived = 'false',
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Validate & clamp pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;
    const isArchived = archived === 'true';

    // Build query
    const query = { isArchived };

    if (status && VALID_STATUSES.includes(status)) {
      query.status = status;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { ticketNumber: searchRegex },
        { customerName: searchRegex },
        { email: searchRegex },
        { resiNumber: searchRegex },
      ];
    }

    const sortField = VALID_SORT_FIELDS.includes(sortBy) ? sortBy : 'createdAt';
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .sort({ [sortField]: sortDir })
        .skip(skip)
        .limit(limitNum)
        .populate('handledBy', 'fullname username')
        .populate('auditLog.performedBy', 'fullname username')
        .lean(),
      Ticket.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    return sendPaginated(
      res,
      tickets,
      {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
      },
      'Tickets retrieved successfully.'
    );
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/v1/admin/tickets/:id ────────────────────────────────────────────
const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid ticket ID format.', 400);
    }

    const ticket = await Ticket.findById(id)
      .populate('handledBy', 'fullname username email')
      .populate('auditLog.performedBy', 'fullname username')
      .lean();

    if (!ticket) {
      return sendError(res, 'Ticket not found.', 404);
    }

    return sendSuccess(res, { ticket }, 'Ticket detail retrieved.');
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/v1/admin/tickets/:id ────────────────────────────────────────────
const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid ticket ID format.', 400);
    }

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return sendError(res, 'Ticket not found.', 404);
    }

    // RULE: Archived tickets are read-only
    if (ticket.isArchived) {
      return sendError(
        res,
        'This ticket is archived and cannot be modified. Archived tickets are read-only.',
        403
      );
    }

    const auditEntries = [];
    let hasChanges = false;

    // ── Status Change ──────────────────────────────────────────────────────────
    if (status !== undefined && status !== ticket.status) {
      if (!VALID_STATUSES.includes(status)) {
        return sendError(
          res,
          `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}.`,
          400
        );
      }
      auditEntries.push(
        createAuditEntry({
          action: 'STATUS_CHANGE',
          oldValue: ticket.status,
          newValue: status,
          performedBy: req.user._id,
        })
      );
      ticket.status = status;
      hasChanges = true;
    }

    // ── Admin Response ─────────────────────────────────────────────────────────
    if (adminResponse !== undefined && adminResponse !== ticket.adminResponse) {
      const trimmed = adminResponse.trim();
      if (trimmed.length > 2000) {
        return sendError(res, 'Admin response cannot exceed 2000 characters.', 400);
      }
      auditEntries.push(
        createAuditEntry({
          action: 'RESPONSE_ADDED',
          oldValue: ticket.adminResponse,
          newValue: trimmed || null,
          performedBy: req.user._id,
        })
      );
      // Simpan null jika dikosongkan, bukan string kosong
      ticket.adminResponse = trimmed || null;
      hasChanges = true;
    }

    if (!hasChanges) {
      return sendError(res, 'No changes detected. Provide status or adminResponse to update.', 400);
    }

    ticket.handledBy = req.user._id;
    ticket.auditLog.push(...auditEntries);
    await ticket.save();

    // Send email update — non-blocking
    if (status !== undefined) {
      sendEmail(statusUpdateTemplate(ticket)).catch((err) =>
        console.error('📧 Status update email error (non-fatal):', err.message)
      );
    }

    const updatedTicket = await Ticket.findById(id)
      .populate('handledBy', 'fullname username')
      .populate('auditLog.performedBy', 'fullname username')
      .lean();

    return sendSuccess(res, { ticket: updatedTicket }, 'Ticket updated successfully.');
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/v1/admin/tickets/bulk-archive ──────────────────────────────────
const bulkArchive = async (req, res, next) => {
  try {
    const { ticketIds } = req.body;

    if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
      return sendError(res, 'ticketIds must be a non-empty array.', 400);
    }

    const validIds = ticketIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length !== ticketIds.length) {
      return sendError(res, 'One or more ticket IDs are invalid.', 400);
    }

    const auditEntry = createAuditEntry({
      action: 'ARCHIVE',
      oldValue: { isArchived: false },
      newValue: { isArchived: true },
      performedBy: req.user._id,
    });

    // Use updateMany — not Promise.all — for atomic-style bulk op
    const result = await Ticket.updateMany(
      { _id: { $in: validIds }, isArchived: false },
      {
        $set: { isArchived: true },
        $push: { auditLog: auditEntry },
      }
    );

    return sendSuccess(
      res,
      {
        requested: ticketIds.length,
        matched: result.matchedCount,
        modified: result.modifiedCount,
      },
      `${result.modifiedCount} ticket(s) archived successfully.`
    );
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/v1/admin/tickets/bulk-restore ─────────────────────────────────
const bulkRestore = async (req, res, next) => {
  try {
    const { ticketIds } = req.body;

    if (!Array.isArray(ticketIds) || ticketIds.length === 0) {
      return sendError(res, 'ticketIds must be a non-empty array.', 400);
    }

    const validIds = ticketIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length !== ticketIds.length) {
      return sendError(res, 'One or more ticket IDs are invalid.', 400);
    }

    const auditEntry = createAuditEntry({
      action: 'RESTORE',
      oldValue: { isArchived: true },
      newValue: { isArchived: false },
      performedBy: req.user._id,
    });

    const result = await Ticket.updateMany(
      { _id: { $in: validIds }, isArchived: true },
      {
        $set: { isArchived: false },
        $push: { auditLog: auditEntry },
      }
    );

    return sendSuccess(
      res,
      {
        requested: ticketIds.length,
        matched: result.matchedCount,
        modified: result.modifiedCount,
      },
      `${result.modifiedCount} ticket(s) restored successfully.`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getTickets,
  getTicketById,
  updateTicket,
  bulkArchive,
  bulkRestore,
};
