const { validationResult } = require("express-validator");
const { HttpStatus } = require("../constants/http-status");
const ApiError = require("../errors/ApiError");
const { asyncMiddleware } = require("./async-middleware");

const validateResultChecker = asyncMiddleware(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      "One or more input params failed validation",
      errors.array()
    );
  }
});

module.exports = {
  validateResultChecker,
};
