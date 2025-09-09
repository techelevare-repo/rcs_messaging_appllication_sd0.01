const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");
const User = require("./User");

const SupportTicket = sequelize.define("SupportTicket", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  status: { type: DataTypes.STRING, defaultValue: "open" },
});

SupportTicket.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

module.exports = SupportTicket;
