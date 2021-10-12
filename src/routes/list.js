const express = require("express");
const { body, param } = require("express-validator");
const {
  getAllLists,
  createList,
  updateList,
  deleteList,
  getList,
} = require("../controllers/list");
const { setCurrentList } = require("../middlewares/set-list");
const { validateResultChecker } = require("../middlewares/validate-result");

const router = express.Router();

router.get("", getAllLists);
router.get(
  "/:listId",
  param("listId").notEmpty().isInt({ gt: 0 }).toInt(),
  getList
);
router.post(
  "",
  body("name").trim().notEmpty().isLength({ max: 260 }),
  validateResultChecker,
  createList
);
router.put(
  "/:listId",
  param("listId").notEmpty().isInt({ gt: 0 }).toInt(),
  body("name").notEmpty().isLength({ max: 260 }),
  setCurrentList,
  validateResultChecker,
  updateList
);
router.delete(
  "/:listId",
  param("listId").notEmpty().isInt({ gt: 0 }).toInt(),
  setCurrentList,
  validateResultChecker,
  deleteList
);

module.exports = router;
