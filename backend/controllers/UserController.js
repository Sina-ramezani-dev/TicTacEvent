const UserService = require("../services/UserService");

class UserController {
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;
      const { user, token } = await UserService.register(name, email, password);
      res.status(201).json({ user, token });
    } catch (err) {
      console.error("Erreur register:", err);
      res.status(err.status || 500).json({ error: err.message || "Erreur serveur" });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token } = await UserService.login(email, password);
      res.status(200).json({ token });
    } catch (err) {
      console.error("Erreur login:", err);
      res.status(err.status || 500).json({ error: err.message || "Erreur serveur" });
    }
  }

  static async getAllUsers(req, res) {
    try {
      const users = await UserService.getAll();
      res.json(users);
    } catch (err) {
      console.error("Erreur getAllUsers:", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await UserService.getProfile(req.user.userId);
      res.json({ user });
    } catch (err) {
      console.error("Erreur profil:", err);
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      await UserService.delete(req.params.id);
      res.json({ message: "Utilisateur supprimé avec succès" });
    } catch (err) {
      console.error("Erreur deleteUser:", err);
      res.status(err.status || 500).json({ error: err.message });
    }
  }

  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { newRole } = req.body;

      if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Accès refusé. Admin requis." });
      }

      if (!["user", "admin"].includes(newRole)) {
        return res.status(400).json({ error: "Rôle invalide" });
      }

      const updatedUser = await UserService.updateRole(id, newRole);
      res.json({ message: "Rôle mis à jour", user: updatedUser });
    } catch (err) {
      console.error("Erreur mise à jour rôle:", err);
      res.status(err.status || 500).json({ error: err.message });
    }
  }
}

module.exports = UserController;
