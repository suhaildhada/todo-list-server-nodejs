"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TodoList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TodoList.belongsTo(models.User);
      TodoList.hasMany(models.TodoListItem, { foreignKey: { name: "listId" } });
    }
  }
  TodoList.init(
    {
      name: {
        type: new DataTypes.STRING(260),
        allowNull: false,
      },
      itemCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "TodoList",
    }
  );
  TodoList.afterCreate(async (todoList) => {
    const user = await todoList.getUser();
    await user.increment("listCount");
  });
  TodoList.afterDestroy(async (todoList) => {
    const user = await todoList.getUser();
    await user.decrement("listCount");
  });
  return TodoList;
};
