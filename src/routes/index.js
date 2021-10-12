const express = require("express");
const authRoutes = require("./auth");
const pingRoutes = require("./ping");
const listRoutes = require("./list");
const listItemRoutes = require("./list-item");
const userRoutes = require("./user");
const { setCurrentList } = require("../middlewares/set-list");
const { authenticated } = require("../middlewares/authenticated");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/ping", pingRoutes);
router.use("/todo-list", authenticated, listRoutes);
router.use(
  "/todo-list/:listId/todo-list-item",
  authenticated,
  setCurrentList,
  listItemRoutes
);
router.use("/user", authenticated, userRoutes);

module.exports = router;
