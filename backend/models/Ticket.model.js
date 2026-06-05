const mongoose = require('mongoose');

// ─── Audit Log Subdocument (Append-Only) ──────────────────────────────────────
const auditLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      enum: {
        values: ['CREATED', 'STATUS_CHANGE', 'ARCHIVE', 'RESTORE', 'RESPONSE_ADDED'],
        message: 'Invalid audit action: {VALUE}',
      },
      required: true,
    },
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newValue: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    performedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // No _id for subdocuments — append-only, immutable
);

// ─── Attachment Subdocument ────────────────────────────────────────────────────
const attachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    filepath: { type: String, required: true },
    mimetype: { type: String, required: true },
    filesize: { type: Number, required: true },
  },
  { _id: false }
);

// ─── Ticket Schema ─────────────────────────────────────────────────────────────
const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      index: true,
      // Auto-generated via util before save
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
      maxlength: [100, 'Customer name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      maxlength: [20, 'Phone number cannot exceed 20 characters'],
    },
    resiNumber: {
      type: String,
      trim: true,
      default: null,
      index: true, // For future resi-based lookups
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['PENGIRIMAN', 'PEMBAYARAN', 'PRODUK', 'LAYANAN', 'LAINNYA'],
        message: 'Category must be one of: PENGIRIMAN, PEMBAYARAN, PRODUK, LAYANAN, LAINNYA',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: [20, 'Description must be at least 20 characters'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    attachment: {
      type: attachmentSchema,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'],
        message: 'Status must be one of: OPEN, IN_PROGRESS, RESOLVED, CLOSED',
      },
      default: 'OPEN',
    },
    adminResponse: {
      type: String,
      default: null,
      maxlength: [2000, 'Admin response cannot exceed 2000 characters'],
    },
    handledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    // Append-Only Audit Log — never overwrite, only push
    auditLog: {
      type: [auditLogSchema],
      default: [],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    versionKey: false,
  }
);

// ─── Index Strategy ────────────────────────────────────────────────────────────

// Compound index for most common admin queries
ticketSchema.index({ isArchived: 1, status: 1, createdAt: -1 });

// Text index — prepared for future Atlas Search migration
ticketSchema.index(
  {
    ticketNumber: 'text',
    customerName: 'text',
    email: 'text',
    resiNumber: 'text',
    description: 'text',
  },
  {
    name: 'ticket_text_search_index',
    weights: {
      ticketNumber: 10,
      resiNumber: 8,
      customerName: 5,
      email: 3,
      description: 1,
    },
  }
);

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;
