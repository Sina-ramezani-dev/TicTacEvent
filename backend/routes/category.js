const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

// Ajouter une catégorie
router.post("/", CategoryController.createCategory);

// Obtenir toutes les catégories
router.get("/", CategoryController.getAllCategories);

module.exports = router;
