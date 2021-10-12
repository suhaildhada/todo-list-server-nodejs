const { HttpStatus } = require("../constants/http-status");
const { asyncMiddleware } = require("../middlewares/async-middleware");

const getCurrentUser = asyncMiddleware(async (req, res) => {
  const user = req.currentUser;
  res.status(HttpStatus.OK).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    name: user.getName(),
  });
});

module.exports = {
  getCurrentUser,
};
