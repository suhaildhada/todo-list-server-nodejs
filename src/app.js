const express = require("express");
const xss = require("xss-clean");
const helmet = require("helmet");
const compression = require("compression");
const routes = require("./routes");
const { errorConverter, errorHandler } = require("./middlewares/error");
const { asyncMiddleware } = require("./middlewares/async-middleware");
const ApiError = require("./errors/ApiError");
const { HttpStatus } = require("./constants/http-status");
require("./models");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(compression());

app.use("/api/v1", routes);

app.use(
  asyncMiddleware(async (req, res) => {
    throw new ApiError(HttpStatus.NOT_FOUND, "Not found");
  })
);

app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
