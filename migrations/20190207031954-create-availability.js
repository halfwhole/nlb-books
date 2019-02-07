'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Availabilities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      branchName: {
        allowNull: false,
        type: Sequelize.STRING
      }, 
      callNumber: {
        allowNull: false,
        type: Sequelize.STRING
      },
      statusDesc: {
        allowNull: false,
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      recordBrn: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
         model: 'Records',
         key: 'brn',
         as: 'recordBrn' 
        }
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Availabilities');
  }
};
