const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Extract error messages into a simpler fields array format
    const fields = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    
    return next(new AppError('Validation failed', 400, fields));
  }
  next();
};

module.exports = { validateRequest };
