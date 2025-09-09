// index.js
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize, jwtSecret } = require("./config");
const jwt = require("jsonwebtoken");

// Models
const User = require("./models/User");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(bodyParser.json());

// --------------------
// TEMP: /register route
// --------------------
app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields required" });
    }

    const user = await User.create({ username, email, passwordHash: password });
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: "1h" });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// --------------------
// /users routes (JWT protected)
// --------------------
app.use("/users", userRoutes);

// --------------------
// Start server + sync DB
// --------------------
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");
    app.listen(3000, () => console.log("Server running on port 3000"));
  })
  .catch((err) => console.error("Database sync error:", err));
