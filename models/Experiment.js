const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const Experiment = sequelize.define("Experiment", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  runBy: DataTypes.UUID,
});

module.exports = Experiment;
