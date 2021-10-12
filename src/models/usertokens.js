"use strict";
const { Model } = require("sequelize");
/**
 *
 * @param {} sequelize
 * @param {DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  class UserToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserToken.belongsTo(models.User);
    }

    isExpired() {
      return this.expiresOn < Math.floor(new Date().getTime() / 1000);
    }

    async updateExpiry() {
      this.expiresOn = Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60;
      await this.save();
    }
  }
  UserToken.init(
    {
      token: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
      },
      expiresOn: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UserToken",
    }
  );
  return UserToken;
};
