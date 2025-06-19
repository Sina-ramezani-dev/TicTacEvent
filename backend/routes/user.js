const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/me", verifyToken, UserController.getProfile);
router.patch("/:id/role", verifyToken, UserController.updateRole); // admin requis
router.get("/", UserController.getAllUsers); // GET /api/users
router.delete("/:id", verifyToken, UserController.deleteUser);



module.exports = router;
