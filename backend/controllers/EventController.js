const EventModel = require("../models/EventModel");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class EventController {
  async createEvent(req, res) {
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

      if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: "Aucune image reçue" });
      }

      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "tictacevent" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const uploadResult = await streamUpload();
      const imageUrl = uploadResult.secure_url;

      const event = await EventModel.createEvent({
        title,
        location,
        date,
        startTime,
        endTime,
        price: price || null,
        free,
        participants,
        coordinates: JSON.parse(coordinates),
        imageUrl,
      });

      res.status(201).json(event);
    } catch (error) {
      console.error("❌ Erreur EventController.createEvent :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  async getAllEvents(req, res) {
    try {
      const events = await EventModel.getAllEvents();
      res.status(200).json(events);
    } catch (error) {
      console.error("Erreur EventController.getAllEvents :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }

  async deleteEvent(req, res) {
  const { id } = req.params;

  try {
    const deleted = await EventModel.deleteById(id);
    if (!deleted) return res.status(404).json({ error: "Événement non trouvé" });

    res.json({ message: "Événement supprimé avec succès" });
  } catch (err) {
    console.error("Erreur deleteEvent:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}


  async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await EventModel.getEventById(id);

      if (!event) {
        return res.status(404).json({ error: "Événement introuvable" });
      }

      res.status(200).json(event);
    } catch (error) {
      console.error("Erreur EventController.getEventById :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
}

module.exports = new EventController();
