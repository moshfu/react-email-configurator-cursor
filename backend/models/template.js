'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Template extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Template.belongsTo(models.User, { foreignKey: 'owner_id' });
    }
  }
  Template.init({
    name: DataTypes.STRING,
    owner_id: DataTypes.INTEGER,
    visibility: DataTypes.STRING,
    category: DataTypes.STRING,
    data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'Template',
  });
  return Template;
};