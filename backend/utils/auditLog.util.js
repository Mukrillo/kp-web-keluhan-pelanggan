/**
 * Audit Log Utility — Append-Only
 *
 * Creates a single audit log entry object to be pushed into ticket.auditLog[].
 * NEVER modify or overwrite existing entries.
 *
 * Schema mirrors auditLogSchema in Ticket.model.js:
 *  action     : CREATED | STATUS_CHANGE | ARCHIVE | RESTORE | RESPONSE_ADDED
 *  oldValue   : previous state (any serializable value)
 *  newValue   : new state (any serializable value)
 *  performedBy: ObjectId ref to User (null for system/public actions)
 *  performedAt: timestamp (defaults to now)
 */

/**
 * @param {Object} params
 * @param {string} params.action
 * @param {*}      [params.oldValue=null]
 * @param {*}      [params.newValue=null]
 * @param {string} [params.performedBy=null] — User ObjectId
 * @returns {Object} audit log entry (ready to push into auditLog[])
 */
const createAuditEntry = ({
  action,
  oldValue = null,
  newValue = null,
  performedBy = null,
}) => ({
  action,
  oldValue,
  newValue,
  performedBy: performedBy || null,
  performedAt: new Date(),
});

module.exports = { createAuditEntry };
