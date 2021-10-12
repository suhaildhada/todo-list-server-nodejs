const { HttpStatus } = require("../constants/http-status");
const ApiError = require("../errors/ApiError");
const { asyncMiddleware } = require("../middlewares/async-middleware");
const { TodoListItem } = require("../models");

const getAllListItems = asyncMiddleware(async (req, res) => {
  const todoList = req.currentTodoList;
  const todoListItems = await TodoListItem.findAll({
    where: {
      listId: todoList.id,
    },
  });
  res.status(HttpStatus.OK).json(todoListItems);
});

const createListItem = asyncMiddleware(async (req, res) => {
  const todoList = req.currentTodoList;
  const user = req.currentUser;
  if (todoList.itemCount >= user.maxListItems) {
    throw new ApiError(
      HttpStatus.BAD_REQUEST,
      `Only ${user.maxListItems} list items are allowed per list.`
    );
  }
  const todoListItem = await todoList.createTodoListItem({
    name: req.body.name,
    completed: req.body.completed,
  });

  res.status(HttpStatus.OK).json(todoListItem);
});

const updateListItem = asyncMiddleware(async (req, res) => {
  const todoListItem = req.currentTodoListItem;
  todoListItem.name = req.body.name;
  todoListItem.completed = req.body.completed;
  await todoListItem.save();
  res.status(HttpStatus.OK).json(todoListItem);
});

const deleteListItem = asyncMiddleware(async (req, res) => {
  const todoListItem = req.currentTodoListItem;
  await todoListItem.destroy();
  res.status(HttpStatus.OK).json({ status: "success" });
});

const deleteAll = asyncMiddleware(async (req, res) => {
  const todoList = req.currentTodoList;
  const count = await TodoListItem.destroy({
    where: {
      listId: todoList.id,
    },
  });
  await todoList.decrement("itemCount", { by: count });
  res.status(HttpStatus.OK).json({ status: "success", deleted: count });
});

const deleteAllCompleted = asyncMiddleware(async (req, res) => {
  const todoList = req.currentTodoList;
  const count = await TodoListItem.destroy({
    where: {
      listId: todoList.id,
      completed: true,
    },
  });
  await todoList.decrement("itemCount", { by: count });
  res.status(HttpStatus.OK).json({ status: "success", deleted: count });
});

module.exports = {
  getAllListItems,
  createListItem,
  updateListItem,
  deleteListItem,
  deleteAll,
  deleteAllCompleted,
};
