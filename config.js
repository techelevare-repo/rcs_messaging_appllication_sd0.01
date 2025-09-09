const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("user_backend", "root", "Rani@19607", {
  host: "localhost",
  dialect: "mysql",
});

const jwtSecret = "your_secret_key";

module.exports = { sequelize, jwtSecret };
