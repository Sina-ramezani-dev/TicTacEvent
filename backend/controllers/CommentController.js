const CommentModel = require("../models/CommentModel");

class CommentController {
  static async getCommentsByEventId(req, res) {
    const { eventId } = req.params;
    try {
      const comments = await CommentModel.getByEventId(eventId);
      res.status(200).json(comments);
    } catch (err) {
      console.error("Erreur getCommentsByEventId :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async addComment(req, res) {
    const { event_id, user_id, content } = req.body;
    if (!event_id || !user_id || !content) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    try {
      const newComment = await CommentModel.create({ event_id, user_id, content });
      res.status(201).json(newComment);
    } catch (err) {
      console.error("Erreur addComment :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async deleteComment(req, res) {
    const { id } = req.params;
    try {
      await CommentModel.delete(id);
      res.status(200).json({ message: "Commentaire supprimé" });
    } catch (err) {
      console.error("Erreur deleteComment :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

module.exports = CommentController;
