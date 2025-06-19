const pool = require("../db");

class FavoriteModel {
  static async create(userId, eventId) {
    const result = await pool.query(
      "INSERT INTO favorites (user_id, event_id, date_ajout) VALUES ($1, $2, NOW()) RETURNING *",
      [userId, eventId]
    );
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await pool.query(`
      SELECT favorites.id AS favorite_id, events.*
      FROM favorites
      JOIN events ON favorites.event_id = events.id
      WHERE favorites.user_id = $1
    `, [userId]);

    return result.rows;
  }

  static async deleteById(id) {
    await pool.query("DELETE FROM favorites WHERE id = $1", [id]);
  }
}

module.exports = FavoriteModel;
