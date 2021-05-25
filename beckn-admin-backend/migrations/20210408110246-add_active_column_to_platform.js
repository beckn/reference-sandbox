"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "Platforms", // table name
        "active", // new field name
        {
          type: Sequelize.BOOLEAN,
          default: true
        }
      ),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("Platforms", "active")]);
  },
};
