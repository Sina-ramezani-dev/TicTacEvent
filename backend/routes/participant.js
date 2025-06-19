const express = require("express");
const router = express.Router();
const participantController = require("../controllers/ParticipantController");

// ✅ Route pour obtenir toutes les participations (admin)
router.get("/all", participantController.getAllParticipations);

// Ajouter une participation
router.post("/", participantController.addParticipation);

// Obtenir les participations d’un utilisateur
router.get("/:userId", participantController.getParticipationsByUser);

// Supprimer une participation par ID
router.delete("/:id", participantController.deleteParticipation);

// Supprimer par userId + eventId
router.delete("/:userId/:eventId", participantController.deleteByUserAndEvent);

module.exports = router;
