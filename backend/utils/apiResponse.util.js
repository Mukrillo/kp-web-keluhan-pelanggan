/**
 * Standard API Response Helpers
 * Enforces consistent response shape across all endpoints:
 * { success, message, data?, pagination? }
 */

const sendSuccess = (res, data = null, message = 'Success', statusCode = 200) => {
  const response = { success: true, message };
  if (data !== null && data !== undefined) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

const sendError = (res, message = 'An error occurred', statusCode = 400) => {
  return res.status(statusCode).json({ success: false, message });
};

const sendPaginated = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination,
  });
};

const sendCreated = (res, data = null, message = 'Created successfully') => {
  return sendSuccess(res, data, message, 201);
};

module.exports = { sendSuccess, sendError, sendPaginated, sendCreated };
