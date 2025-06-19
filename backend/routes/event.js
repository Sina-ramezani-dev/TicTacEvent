const express = require("express");
const router = express.Router();
const EventController = require("../controllers/EventController");
const verifyToken = require("../middleware/verifyToken");


// Multer configuration pour stockage en mémoire (nécessaire pour Cloudinary)
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), EventController.createEvent);
router.get("/", EventController.getAllEvents);
router.get("/:id", EventController.getEventById);
router.delete("/:id", verifyToken, EventController.deleteEvent);


module.exports = router;
