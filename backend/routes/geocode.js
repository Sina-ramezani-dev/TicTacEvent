const express = require("express");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args)); // 👈 Fix pour Node.js
const router = express.Router();

router.get("/", async (req, res) => {
  const address = req.query.address;

  if (!address || address.length < 3) {
    return res.status(400).json({ error: "Adresse invalide ou manquante." });
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          "User-Agent": "TicTacEvent/1.0 (contact@tictacevent.com)", // Change ça si besoin
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Erreur lors de la requête Nominatim" });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Erreur backend /api/geocode :", err);
    res.status(500).json({ error: "Erreur de serveur" });
  }
});

module.exports = router;
