const express = require("express");
const router = express.Router();
const CommentController = require("../controllers/CommentController");

// ➕ Ajouter un commentaire
router.post("/", CommentController.addComment);

// 🔍 Récupérer les commentaires d’un événement
router.get("/event/:eventId", CommentController.getCommentsByEventId);

// 🗑 Supprimer un commentaire
router.delete("/:id", CommentController.deleteComment);

module.exports = router;
