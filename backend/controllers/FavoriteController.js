const pool = require("../db");

class FavoriteController {
  async addFavorite(req, res) {
    const { user_id, event_id } = req.body;

    try {
      const result = await pool.query(
        "INSERT INTO favorites (user_id, event_id, added_at) VALUES ($1, $2, NOW()) RETURNING *",
        [user_id, event_id]
      );
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Erreur addFavorite :", error);
      res.status(500).json({ error: "Erreur ajout favori" });
    }
  }

  async getFavoritesByUser(req, res) {
    const { userId } = req.params;

    try {
      const result = await pool.query(
        `SELECT favorites.id AS favorite_id, events.*
         FROM favorites
         JOIN events ON favorites.event_id = events.id
         WHERE favorites.user_id = $1`,
        [userId]
      );
      res.json(result.rows);
    } catch (error) {
      console.error("Erreur getFavoritesByUser :", error);
      res.status(500).json({ error: "Erreur récupération favoris" });
    }
  }

  async deleteFavorite(req, res) {
    const { id } = req.params;

    try {
      await pool.query("DELETE FROM favorites WHERE id = $1", [id]);
      res.json({ message: "Favori supprimé" });
    } catch (error) {
      console.error("Erreur deleteFavorite :", error);
      res.status(500).json({ error: "Erreur suppression favori" });
    }
  }

  async deleteByUserAndEvent(req, res) {
  const { userId, eventId } = req.params;

  try {
    await pool.query("DELETE FROM favorites WHERE user_id = $1 AND event_id = $2", [
      userId,
      eventId,
    ]);
    res.json({ message: "Favori supprimé avec succès" });
  } catch (error) {
    console.error("Erreur deleteByUserAndEvent :", error);
    res.status(500).json({ error: "Erreur suppression favori" });
  }
}



}

module.exports = new FavoriteController();
