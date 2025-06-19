const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/user"));
app.use("/api/events", require("./routes/event"));
app.use("/api/participations", require("./routes/participant"));
app.use("/api/categories", require("./routes/category"));
app.use("/api/favorites", require("./routes/favorite"));
app.use("/api/comments", require("./routes/comment"));
app.use("/api/geocode", require("./routes/geocode"));
app.use("/api", require("./routes/admin"));
app.use("/api/users", require("./routes/user"));

// Test route
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API TicTacEvent 🚀");
});

// Middleware erreurs
app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err);
  res.status(500).json({ error: "Erreur serveur" });
});

module.exports = app;
