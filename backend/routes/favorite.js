// routes/favorite.js
const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/FavoriteController");

// Ajouter un favori
router.post("/", favoriteController.addFavorite);

// Obtenir les favoris d’un utilisateur
router.get("/:userId", favoriteController.getFavoritesByUser);

// Supprimer un favori via ID du favori (ancien système)
router.delete("/:id", favoriteController.deleteFavorite);

// ✅ Nouvelle route pour supprimer par user_id ET event_id
router.delete("/:userId/:eventId", favoriteController.deleteByUserAndEvent);

module.exports = router;
