const pool = require("../db");
const bcrypt = require("bcrypt");

class UserModel {
  static async create(name, email, password) {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4) RETURNING id, name, email, role`,
      [name, email, hashed, 'user'] // rôle par défaut
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
    return result.rows[0];
  }

  static async getAll() {
  const result = await pool.query("SELECT id, name, email, role FROM users");
  return result.rows;
}


  static async deleteById(id) {
  const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  return result.rowCount > 0;
}

  static async findById(id) {
    const result = await pool.query(
      `SELECT id, name, email, role FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async updateRole(userId, newRole) {
    const result = await pool.query(
      `UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role`,
      [newRole, userId]
    );
    return result.rows[0];
  }
}

module.exports = UserModel;
