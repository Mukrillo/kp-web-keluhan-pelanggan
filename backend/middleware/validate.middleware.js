/**
 * validate — Generic validation middleware factory
 *
 * Usage:
 *   router.post('/route', validate((req) => {
 *     if (!req.body.name) return 'Name is required';
 *     return null; // No error
 *   }), controller);
 *
 * Returns 400 with the error message if validator returns a string.
 * Proceeds to next middleware if validator returns null/undefined.
 */
const validate = (validatorFn) => (req, res, next) => {
  const error = validatorFn(req);
  if (error) {
    return res.status(400).json({ success: false, message: error });
  }
  next();
};

module.exports = validate;
