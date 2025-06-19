require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`✅ Serveur TicTacEvent lancé sur le port ${PORT}`);
  });
}

module.exports = app;