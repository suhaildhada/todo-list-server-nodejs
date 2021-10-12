const express = require("express");
const { body, param } = require("express-validator");
const {
  getAllListItems,
  createListItem,
  updateListItem,
  deleteListItem,
  deleteAll,
  deleteAllCompleted,
} = require("../controllers/list-item");
const { setCurrentListItem } = require("../middlewares/set-list");
const { validateResultChecker } = require("../middlewares/validate-result");

const router = express.Router();

router.get("", getAllListItems);
router.post(
  "",
  body("name").notEmpty().trim().isLength({ max: 260 }),
  body("completed").isBoolean().toBoolean(),
  validateResultChecker,
  createListItem
);
router.put(
  "/:listItemId",
  param("listItemId").notEmpty().isInt({ gt: 0 }).toInt(),
  body("name").notEmpty().trim().isLength({ max: 260 }),
  body("completed").isBoolean().toBoolean(),
  validateResultChecker,
  setCurrentListItem,
  updateListItem
);
router.delete("/all", deleteAll);
router.delete("/completed", deleteAllCompleted);
router.delete(
  "/:listItemId",
  param("listItemId").notEmpty().isInt({ gt: 0 }).toInt(),
  setCurrentListItem,
  deleteListItem
);

module.exports = router;
