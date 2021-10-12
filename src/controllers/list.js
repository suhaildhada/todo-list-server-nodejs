const { HttpStatus } = require("../constants/http-status");
const ApiError = require("../errors/ApiError");
const { asyncMiddleware } = require("../middlewares/async-middleware");
const { TodoList, TodoListItem } = require("../models");

const getAllLists = asyncMiddleware(async (req, res) => {
  const user = req.currentUser;
  const todoLists = await TodoList.findAll({
    where: {
      userId: user.id,
    },
  });
  res.status(HttpStatus.OK).json(todoLists);
});

const getList = asyncMiddleware(async (req, res) => {
  const { listId } = req.params;
  const user = req.currentUser;
  const todoList = await TodoList.findOne({
    where: {
      id: listId,
      userId: user.id,
    },
    include: TodoListItem,
    order: [[TodoListItem, "id", "DESC"]],
  });
  if (!todoList) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Not found");
  }
  res.status(HttpStatus.OK).json(todoList);
});

const createList = asyncMiddleware(async (req, res) => {
  const user = req.currentUser;
  if (user.listCount >= user.maxLists) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      `Only ${user.maxLists} lists are allowed per user.`
    );
  }

  const todoList = await user.createTodoList({
    name: req.body.name,
  });

  res.status(HttpStatus.OK).json(todoList);
});

const updateList = asyncMiddleware(async (req, res) => {
  const todoList = req.currentTodoList;
  todoList.name = req.body.name;
  await todoList.save();
  res.status(HttpStatus.OK).json(todoList);
});

const deleteList = asyncMiddleware(async (req, res) => {
  const todoList = req.currentTodoList;
  await todoList.destroy();
  res.status(HttpStatus.OK).json({ status: "success" });
});

module.exports = {
  getAllLists,
  getList,
  createList,
  updateList,
  deleteList,
};
