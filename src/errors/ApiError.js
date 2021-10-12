class ApiError extends Error {
  constructor(status, message, errors, isOperational = true, stack = null) {
    super();
    this.statusCode = status;
    this.message = message;
    this.errors = errors;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = ApiError;
