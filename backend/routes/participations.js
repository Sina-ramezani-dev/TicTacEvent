const express = require("express");
const router = express.Router();
const pool = require("../db");

// ➡️ Participer à un événement
router.post("/", async (req, res) => {
  const { user_id, event_id } = req.body;

  if (!user_id || !event_id) {
    return res.status(400).json({ error: "user_id et event_id requis" });
  }

  try {
    const existing = await pool.query(
      "SELECT * FROM participations WHERE user_id = $1 AND event_id = $2",
      [user_id, event_id]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Déjà inscrit à cet événement" });
    }

    const result = await pool.query(
      "INSERT INTO participations (user_id, event_id) VALUES ($1, $2) RETURNING *",
      [user_id, event_id]
    );

    res.status(201).json({ message: "Participation enregistrée", participation: result.rows[0] });
  } catch (error) {
    console.error("Erreur participation :", error);
    res.status(500).json({ error: "Erreur lors de la participation" });
  }
});

// Obtenir toutes les réservations d’un utilisateur
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(`
      SELECT participations.id AS participation_id, events.*
      FROM participations
      JOIN events ON participations.event_id = events.id
      WHERE participations.user_id = $1
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Erreur GET participations :", error);
    res.status(500).json({ error: "Erreur lors de la récupération" });
  }
});

// Supprimer une réservation
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM participations WHERE id = $1", [id]);
    res.json({ message: "Réservation supprimée" });
  } catch (error) {
    console.error("Erreur DELETE participation :", error);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

  

module.exports = router;

