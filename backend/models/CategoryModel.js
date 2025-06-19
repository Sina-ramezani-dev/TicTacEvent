const pool = require("../db");

class CategoryModel {
  static async findAll() {
    const result = await pool.query("SELECT * FROM categories");
    return result.rows;
  }

  static async create(name) {
    const result = await pool.query(
      "INSERT INTO categories (name) VALUES ($1) RETURNING *",
      [name]
    );
    return result.rows[0];
  }

  static async deleteById(id) {
    await pool.query("DELETE FROM categories WHERE id = $1", [id]);
  }
}

module.exports = CategoryModel;
