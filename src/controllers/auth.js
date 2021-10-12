const { HttpStatus } = require("../constants/http-status");
const ApiError = require("../errors/ApiError");
const { asyncMiddleware } = require("../middlewares/async-middleware");
const { User, UserToken } = require("../models");

const login = asyncMiddleware(async (req, res) => {
  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!user) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid email or password");
  }
  const result = await user.comparePassword(req.body.password);
  if (!result) {
    throw new ApiError(HttpStatus.BAD_REQUEST, "Invalid email or password");
  }

  const userToken = await user.createUserToken({
    expiresOn: Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60, // expires in one day
  });

  res.status(HttpStatus.OK).json({ token: userToken });
});

const signup = asyncMiddleware(async (req, res) => {
  await User.create({
    email: req.body.email,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });

  res.status(HttpStatus.OK).json({ status: "success" });
});

const logout = asyncMiddleware(async (req, res) => {
  const userToken = req.currentUserToken;
  await userToken.destroy();
  res.status(HttpStatus.OK).json({
    status: "success",
  });
});

const checkEmail = asyncMiddleware(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  const response = {
    valid: !user,
  };
  res.status(HttpStatus.OK).json(response);
});

module.exports = {
  login,
  signup,
  logout,
  checkEmail,
};
