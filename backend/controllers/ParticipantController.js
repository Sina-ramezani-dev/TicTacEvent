const pool = require("../db");

class ParticipantController {
  async addParticipation(req, res) {
    const { user_id, event_id } = req.body;

    try {
      const result = await pool.query(
        "INSERT INTO participations (user_id, event_id, date_inscription) VALUES ($1, $2, NOW()) RETURNING *",
        [user_id, event_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Erreur addParticipation :", error);
      res.status(500).json({ error: "Erreur lors de l'inscription" });
    }
  }

  async getParticipationsByUser(req, res) {
    const { userId } = req.params;

    try {
      const result = await pool.query(
        `SELECT participations.id AS participation_id, events.*
         FROM participations
         JOIN events ON participations.event_id = events.id
         WHERE participations.user_id = $1`,
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Erreur getParticipationsByUser :", error);
      res.status(500).json({ error: "Erreur récupération participations" });
    }
  }

  async getAllParticipations(req, res) {
  try {
    const result = await pool.query(`
      SELECT p.user_id, p.event_id, e.title, e.location, e.date, e.start_time, e.price, e.free, u.name
      FROM participations p
      JOIN events e ON p.event_id = e.id
      JOIN users u ON p.user_id = u.id
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Erreur getAllParticipations :", error);
    res.status(500).json({ error: "Erreur récupération des participations" });
  }
}



  async deleteParticipation(req, res) {
    const { id } = req.params;

    try {
      await pool.query("DELETE FROM participations WHERE id = $1", [id]);
      res.json({ message: "Participation supprimée" });
    } catch (error) {
      console.error("Erreur deleteParticipation :", error);
      res.status(500).json({ error: "Erreur suppression participation" });
    }
  }

  async deleteByUserAndEvent(req, res) {
    const { userId, eventId } = req.params;

    try {
      await pool.query(
        "DELETE FROM participations WHERE user_id = $1 AND event_id = $2",
        [userId, eventId]
      );
      res.json({ message: "Participation supprimée avec succès" });
    } catch (error) {
      console.error("Erreur deleteByUserAndEvent :", error);
      res.status(500).json({ error: "Erreur suppression" });
    }
  }
}

module.exports = new ParticipantController();
