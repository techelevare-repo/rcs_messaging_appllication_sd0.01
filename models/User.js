const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const User = sequelize.define("User", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  username: DataTypes.STRING,
  email: DataTypes.STRING,
  passwordHash: DataTypes.STRING,
  interests: DataTypes.JSON,
});

module.exports = User;
