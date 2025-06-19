const CategoryModel = require("../models/CategoryModel");

class CategoryController {
  async createCategory(req, res) {
    try {
      const { name } = req.body;
      const category = await CategoryModel.createCategory(name);
      res.status(201).json(category);
    } catch (err) {
      console.error("Erreur création catégorie :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  async getAllCategories(req, res) {
    try {
      const categories = await CategoryModel.getAllCategories();
      res.json(categories);
    } catch (err) {
      console.error("Erreur get catégories :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await CategoryModel.deleteCategory(id);
      res.json({ message: "Catégorie supprimée" });
    } catch (err) {
      console.error("Erreur suppression catégorie :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

module.exports = new CategoryController();
