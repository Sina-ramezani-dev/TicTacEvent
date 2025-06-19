const db = require("../db");

class CommentModel {
  static async create({ event_id, user_id, content }) {
    const result = await db.query(
      `INSERT INTO comments (event_id, user_id, content, created_at)
       VALUES ($1, $2, $3, NOW())
       RETURNING *`,
      [event_id, user_id, content]
    );
    return result.rows[0];
  }

  static async getByEventId(eventId) {
    const result = await db.query(
      `SELECT c.id, c.content, c.created_at, u.name AS author
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.event_id = $1
       ORDER BY c.created_at DESC`,
      [eventId]
    );
    return result.rows;
  }

  static async delete(commentId) {
    const result = await db.query(
      `DELETE FROM comments WHERE id = $1 RETURNING *`,
      [commentId]
    );
    return result.rows[0];
  }
}

module.exports = CommentModel;
