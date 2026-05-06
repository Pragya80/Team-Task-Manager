const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  if (process.env.NODE_ENV === 'development') {
    console.error('ERROR 💥:', err);
  } else if (err.statusCode === 500) {
    // Only log stack for 500 errors in production
    console.error('ERROR 💥:', err.stack);
  }

  // Construct response payload
  const payload = {
    error: true,
    message: err.isOperational ? err.message : 'Something went wrong on our end.',
  };

  if (err.fields) {
    payload.fields = err.fields;
  }

  // If we are in development, we can send back more info but for MVP strictness, we'll keep it unified
  res.status(err.statusCode).json(payload);
};

module.exports = errorHandler;
