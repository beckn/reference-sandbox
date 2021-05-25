"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "Platforms", // table name
        "is_mock", // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        }
      ),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("Platforms", "is_mock")]);
  },
};
