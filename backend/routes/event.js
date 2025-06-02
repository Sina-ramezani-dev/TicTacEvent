const express = require("express");
const router = express.Router();
const pool = require("../db");
const cloudinary = require("cloudinary").v2;
const multer = require("multer");


// 📸 Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🧠 Config multer pour gérer les fichiers
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      location,
      date,
      startTime,
      endTime,
      price,
      free,
      participants,
      coordinates,
    } = req.body;

    // Upload image vers Cloudinary
    const uploadedImage = await cloudinary.uploader.upload_stream(
      { folder: "tictacevent" },
      async (error, result) => {
        if (error) {
          console.error("Erreur Cloudinary :", error);
          return res.status(500).json({ error: "Échec de l’upload d’image" });
        }

        const imageUrl = result.secure_url;

        const coord = JSON.parse(coordinates); // tableau [lat, lng]

        const resultDB = await pool.query(
          `INSERT INTO events (title, location, date, start_time, end_time, price, free, participants, coordinates, image_url)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
          [title, location, date, startTime, endTime, price || null, free, participants, coord, imageUrl]
        );

        return res.status(201).json(resultDB.rows[0]);
      }
    );

    // Pipe l’image dans le stream Cloudinary
    if (req.file && req.file.buffer) {
      const stream = require("streamifier").createReadStream(req.file.buffer);
      stream.pipe(uploadedImage);
    } else {
      return res.status(400).json({ error: "Aucune image reçue" });
    }
  } catch (err) {
    console.error("❌ Erreur POST /api/events :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// ✅ GET : Tous les événements
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM events ORDER BY date DESC");
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Erreur récupération :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});


// ✅ Récupérer un événement par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM events WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Événement introuvable" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Erreur GET /:id :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
