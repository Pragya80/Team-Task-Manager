class AppError extends Error {
  constructor(message, statusCode, fields = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.fields = fields;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
