"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TodoListItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TodoListItem.belongsTo(models.TodoList, {
        foreignKey: { name: "listId" },
      });
    }
  }
  TodoListItem.init(
    {
      name: {
        type: new DataTypes.STRING(260),
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "TodoListItem",
    }
  );
  TodoListItem.afterCreate(async (todoListItem, options) => {
    /** @type {Model} */
    const todoList = await todoListItem.getTodoList();
    await todoList.increment("itemCount");
  });
  TodoListItem.afterDestroy(async (todoListItem, options) => {
    /** @type {Model} */
    const todoList = await todoListItem.getTodoList();
    await todoList.decrement("itemCount");
  });
  return TodoListItem;
};
