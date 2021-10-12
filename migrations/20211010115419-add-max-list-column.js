"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn("Users", "maxLists", {
      type: Sequelize.INTEGER,
      defaultValue: 100,
      allowNull: false,
      after: "listCount",
    });
    await queryInterface.addColumn("Users", "maxListItems", {
      type: Sequelize.INTEGER,
      defaultValue: 100,
      allowNull: false,
      after: "maxLists",
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Users", "maxLists");
    await queryInterface.removeColumn("Users", "maxListItems");
  },
};
