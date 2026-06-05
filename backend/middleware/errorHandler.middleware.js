/**
 * Global Error Handler Middleware
 *
 * Handles: Mongoose validation, duplicate key, cast errors,
 * Multer file errors, JWT errors, and generic errors.
 * Must be the LAST middleware registered in Express.
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || err.status || 500;
  let message = err.message || 'Internal Server Error';

  // ── Mongoose: Validation Error ─────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const messages = Object.values(err.errors).map((e) => e.message);
    message = messages.join('. ');
  }

  // ── Mongoose: Duplicate Key Error ──────────────────────────────────────────
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);
    message = `${capitalizedField} already exists. Please use a different value.`;
  }

  // ── Mongoose: Cast Error (invalid ObjectId) ────────────────────────────────
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value provided for field '${err.path}'.`;
  }

  // ── Multer: File Size / Upload Error ───────────────────────────────────────
  if (err.name === 'MulterError') {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds the maximum allowed limit of 5MB.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected field name for file upload.';
    } else {
      message = `File upload error: ${err.message}`;
    }
  }

  // ── JWT Errors ─────────────────────────────────────────────────────────────
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired. Please log in again.';
  }

  // ── Development Logging ────────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'development') {
    console.error(`\n[ERROR] ${new Date().toISOString()}`);
    console.error(`Path: ${req.method} ${req.originalUrl}`);
    console.error(err.stack || err);
    console.error('');
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      errorName: err.name,
    }),
  });
};

module.exports = errorHandler;
