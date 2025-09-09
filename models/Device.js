const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");
const User = require("./User");

const Device = sequelize.define("Device", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  deviceName: DataTypes.STRING,
});

Device.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = Device;
