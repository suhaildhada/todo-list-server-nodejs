const { asyncMiddleware } = require("./async-middleware");
const { TodoList, TodoListItem } = require("../models");
const ApiError = require("../errors/ApiError");
const { HttpStatus } = require("../constants/http-status");

const setCurrentList = asyncMiddleware(async (req, res) => {
  const user = req.currentUser;
  const todoList = await TodoList.findOne({
    where: {
      id: req.params.listId,
      userId: user.id,
    },
  });
  if (!todoList) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Not found");
  }
  req.currentTodoList = todoList;
});

const setCurrentListItem = asyncMiddleware(async (req, res) => {
  const todoList = req.currentTodoList;
  const user = req.currentUser;

  const todoListItem = await TodoListItem.findOne({
    where: {
      id: req.params.listItemId,
      listId: todoList.id,
    },
  });

  if (!todoListItem) {
    throw new ApiError(HttpStatus.NOT_FOUND, "Not found");
  }

  req.currentTodoListItem = todoListItem;
});

module.exports = {
  setCurrentList,
  setCurrentListItem,
};
