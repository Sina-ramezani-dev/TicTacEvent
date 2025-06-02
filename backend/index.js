  require("dotenv").config();
  const express = require("express");
  const cors = require("cors");


  const authRoutes = require("./routes/auth");
  const eventRoutes = require("./routes/event");

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/events", eventRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
  });

  app.use("/api/events", eventRoutes);

  const participationRoutes = require("./routes/participations");
  app.use("/api/participations", participationRoutes);
