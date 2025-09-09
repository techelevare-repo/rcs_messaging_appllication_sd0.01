const { DataTypes } = require("sequelize");
const { sequelize } = require("../config");

const PrivacyPolicy = sequelize.define("PrivacyPolicy", {
  id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
  content: DataTypes.TEXT,
  acceptedAt: DataTypes.DATE,
  userId: DataTypes.UUID,
});

module.exports = PrivacyPolicy;
