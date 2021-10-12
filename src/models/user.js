"use strict";
const { Model, DataTypes } = require("sequelize");
const { comparePassword, hashPassword } = require("../utils/passwod");
/**
 *
 * @param {*} sequelize
 * @param {DataTypes} DataTypes
 * @returns User
 */
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.TodoList);
      User.hasMany(models.UserToken);
    }

    async comparePassword(password) {
      return comparePassword(this.password, password);
    }

    getName() {
      return `${this.firstName} ${this.lastName}`;
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: new DataTypes.STRING(100),
        allowNull: false,
      },
      firstName: {
        type: new DataTypes.STRING(260),
        allowNull: false,
      },
      lastName: {
        type: new DataTypes.STRING(260),
        allowNull: false,
      },
      maxLists: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      maxListItems: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100,
      },
      listCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  /**
   *
   * @param {User} user
   * @param {*} options
   */
  const hashPasswordHook = async function (user, options) {
    if (!user.changed("password")) return;
    const hashed = await hashPassword(user.password);
    user.password = hashed;
  };
  User.beforeCreate(hashPasswordHook);
  User.beforeUpdate(hashPasswordHook);
  return User;
};
