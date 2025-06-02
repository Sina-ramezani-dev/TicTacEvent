const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

// ✅ Inscription
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  console.log("Tentative d'inscription :", name, email);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ user, token });
  } catch (err) {
    console.error("Erreur dans /register :", err);
    res.status(500).json({ error: "Erreur lors de l'inscription" });
  }
});

// ✅ Connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) return res.status(400).json({ error: "Utilisateur introuvable" });

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect" });

    // ✅ Création du token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    res.json({ token }); // ne renvoie que le token ici
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Obtenir le profil de l'utilisateur connecté
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [req.userId]);
    const user = result.rows[0];
    res.json({ user });
  } catch (err) {
    console.error("Erreur dans /me :", err);
    res.status(500).json({ error: "Erreur lors de la récupération du profil" });
  }
});

module.exports = router;
