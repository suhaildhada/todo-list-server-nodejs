const { HttpStatus } = require("../constants/http-status");
const ApiError = require("../errors/ApiError");
const { asyncMiddleware } = require("./async-middleware");
const { User, UserToken } = require("../models");

const authenticated = asyncMiddleware(async (req, res) => {
  const auth = req.get("Authorization") || "";
  const authParts = auth.split(" ");

  const unauthorized = () => {
    throw new ApiError(HttpStatus.UNAUTHORIZED, "Invalid user");
  };

  if (authParts[0] !== "Bearer" || authParts.length < 2) {
    unauthorized();
  }
  const token = authParts[1];

  const userToken = await UserToken.findOne({
    where: {
      token,
    },
  });

  if (!userToken || userToken.isExpired()) {
    unauthorized();
  }

  const [, user] = await Promise.all([
    userToken.updateExpiry(),
    userToken.getUser(),
  ]);

  req.currentUserToken = userToken;
  req.currentUser = user;
});

module.exports = {
  authenticated,
};
