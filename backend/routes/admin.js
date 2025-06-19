const express = require("express");
const router = express.Router();
const pool = require("../db");

// 📌 Récupérer tous les utilisateurs
router.get("/users", async (req, res) => {
  const result = await pool.query("SELECT id, name, email FROM users ORDER BY id");
  res.json(result.rows);
});

// 📌 Toutes les participations (avec détails utilisateur + event)
router.get("/participations", async (req, res) => {
  const result = await pool.query(`
    SELECT participations.id as participation_id, users.name, events.title, events.date, events.start_time,
           events.location, events.price, events.free
    FROM participations
    JOIN users ON users.id = participations.user_id
    JOIN events ON events.id = participations.event_id
    ORDER BY participations.id DESC
  `);
  res.json(result.rows);
});

module.exports = router;
