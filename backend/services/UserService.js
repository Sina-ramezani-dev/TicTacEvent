    const UserModel = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { isPasswordStrong } = require("../utils/passwordUtils");

class UserService {
  static async register(name, email, password) {
    if (!isPasswordStrong(password)) {
      throw { status: 400, message: "Mot de passe faible" };
    }

    const user = await UserModel.create(name, email, password);
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return { user, token };
  }

  static async login(email, password) {
    const user = await UserModel.findByEmail(email);
    if (!user) throw { status: 400, message: "Utilisateur introuvable" };

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw { status: 400, message: "Mot de passe incorrect" };

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    return { token };
  }

  static async getAll() {
    return await UserModel.getAll();
  }

  static async getProfile(userId) {
    const user = await UserModel.findById(userId);
    if (!user) throw { status: 404, message: "Utilisateur introuvable" };
    return user;
  }

  static async delete(id) {
    const deleted = await UserModel.deleteById(id);
    if (!deleted) throw { status: 404, message: "Utilisateur non trouvé" };
    return true;
  }

  static async updateRole(id, newRole) {
    return await UserModel.updateRole(id, newRole);
  }
}

module.exports = UserService;
