const pool = require("../db");

class ParticipantModel {
  static async create(userId, eventId) {
    const result = await pool.query(
      "INSERT INTO participations (user_id, event_id) VALUES ($1, $2) RETURNING *",
      [userId, eventId]
    );
    return result.rows[0];
  }

  static async exists(userId, eventId) {
    const result = await pool.query(
      "SELECT * FROM participations WHERE user_id = $1 AND event_id = $2",
      [userId, eventId]
    );
    return result.rows.length > 0;
  }

  static async findByUserId(userId) {
    const result = await pool.query(`
      SELECT participations.id AS participation_id, events.*
      FROM participations
      JOIN events ON participations.event_id = events.id
      WHERE participations.user_id = $1
    `, [userId]);

    return result.rows;
  }

  static async deleteById(id) {
    await pool.query("DELETE FROM participations WHERE id = $1", [id]);
  }

  // ✅ Ajouté pour l'espace admin : liste complète des participations
  static async findAll() {
    const result = await pool.query(`
      SELECT p.user_id, p.event_id, e.title, e.location, e.date, e.start_time, e.price, e.free, u.name
      FROM participations p
      JOIN events e ON p.event_id = e.id
      JOIN users u ON p.user_id = u.id
    `);
    return result.rows;
  }
}

module.exports = ParticipantModel;
