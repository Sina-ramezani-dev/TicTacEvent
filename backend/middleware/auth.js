const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const verifyToken = require("../middleware/verifyToken");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  if (result.rows.length === 0) return res.status(400).json({ error: "Utilisateur introuvable" });

  const user = result.rows[0];

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
  res.json({ token });
});


router.get("/me", verifyToken, async (req, res) => {
  const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [
    req.user.id,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  res.status(200).json({ user: result.rows[0] });
});


module.exports = router;
