const express = require("express");
const { body } = require("express-validator");
const { login, signup, logout, checkEmail } = require("../controllers/auth");
const { authenticated } = require("../middlewares/authenticated");
const { validateResultChecker } = require("../middlewares/validate-result");
const { User } = require("../models");

const router = express.Router();

router.post(
  "/login",
  body("email").notEmpty().isEmail().normalizeEmail(),
  body("password").notEmpty(),
  validateResultChecker,
  login
);

router.post(
  "/signup",
  body("email")
    .notEmpty()
    .isEmail()
    .custom(async (value) => {
      const user = await User.findOne({ where: { email: value } });
      if (user) {
        return Promise.reject("Email is already in use.");
      }
      return true;
    })
    .normalizeEmail()
    .isLength({ max: 100 }),
  body("password").notEmpty(),
  body("firstName").notEmpty().trim().isLength({ max: 260 }),
  body("lastName").notEmpty().trim().isLength({ max: 260 }),
  validateResultChecker,
  signup
);

router.post("/logout", authenticated, logout);

router.post(
  "/checkemail",
  body("email").isEmail().normalizeEmail(),
  validateResultChecker,
  checkEmail
);

module.exports = router;
