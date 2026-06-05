const Ticket = require('../models/Ticket.model');

/**
 * Generates a unique ticket number in the format: TKT-YYYYMM-XXXXX
 *
 * e.g. TKT-202406-00001
 *
 * Strategy:
 *  1. Find the latest ticket with the current month prefix (sorted DESC)
 *  2. Extract the sequence number and increment by 1
 *  3. If no ticket exists for this month, start at 00001
 *
 * Thread-safe: MongoDB unique index on ticketNumber ensures
 * no race condition duplicates reach the database.
 */
const generateTicketNumber = async () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const prefix = `TKT-${year}${month}`;

  // Find the highest sequence number for the current month
  const latestTicket = await Ticket.findOne(
    { ticketNumber: { $regex: `^${prefix}-` } },
    { ticketNumber: 1 },
    { sort: { ticketNumber: -1 }, lean: true }
  );

  let sequence = 1;

  if (latestTicket && latestTicket.ticketNumber) {
    const parts = latestTicket.ticketNumber.split('-');
    const lastSeq = parseInt(parts[parts.length - 1], 10);
    if (!isNaN(lastSeq)) {
      sequence = lastSeq + 1;
    }
  }

  const paddedSeq = String(sequence).padStart(5, '0');
  return `${prefix}-${paddedSeq}`;
};

module.exports = { generateTicketNumber };
