'use strict';
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define('Record', {
    brn: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: ''
    }
  }, {});
  Record.associate = function(models) {
    // associations can be defined here
    Record.hasMany(models.Availability, {
      foreignKey: 'recordBrn',
      sourceKey: 'brn',
      as: 'availabilities'
    });
  };
  return Record;
};
