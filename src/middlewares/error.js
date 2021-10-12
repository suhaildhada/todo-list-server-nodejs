const { HttpStatus } = require("../constants/http-status");
const ApiError = require("../errors/ApiError");
const { isProduction, isDevelopment } = require("../utils/environment");

function errorConverter(err, req, res, next) {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || "Internal server error";
    error = new ApiError(statusCode, message, null, false, err.stack);
  }
  next(error);
}

function errorHandler(err, req, res, next) {
  let { statusCode, message, errors } = err;
  if (isProduction() && !err.isOperational) {
    statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    message = "Internal server error";
  }
  const response = {
    code: statusCode,
    message,
    errors,
    ...(isDevelopment() ? { stack: err.stack } : null),
  };

  console.log(err);

  res.status(statusCode).json(response);
}

module.exports = {
  errorConverter,
  errorHandler,
};
