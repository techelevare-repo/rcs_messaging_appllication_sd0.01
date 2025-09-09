const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");
const User = require("./User");

const Session = sequelize.define("Session", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  device: DataTypes.STRING,
  token: DataTypes.STRING,
});

Session.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Session;
