const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const Terms = sequelize.define("Terms", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  content: DataTypes.TEXT,
  acceptedAt: DataTypes.DATE,
  userId: DataTypes.UUID,
});

module.exports = Terms;
