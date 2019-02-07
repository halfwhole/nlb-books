'use strict';
module.exports = (sequelize, DataTypes) => {
  const Availability = sequelize.define('Availability', {
    branchName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    callNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    statusDesc: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Availability.associate = function(models) {
    Availability.belongsTo(models.Record, {
      foreignKey: 'recordId',
      onDelete: 'CASCADE'
    });
  };
  return Availability;
};
