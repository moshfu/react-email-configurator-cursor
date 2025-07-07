'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GroupVisibility extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  GroupVisibility.init({
    group_id: DataTypes.INTEGER,
    can_see_group_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'GroupVisibility',
  });
  return GroupVisibility;
};