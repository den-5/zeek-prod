require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const gamesRoutes = require("./routes/games");
const adminRoutes = require("./routes/admin");
const bodyParser = require("body-parser");
const http = require("http");
const { initializeWebSocket } = require("./tools/websocket-service");

const app = express();

if (!process.env.DB_URL) {
  console.error("CRITICAL: DB_URL environment variable is not set. Server cannot start.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("CRITICAL: JWT_SECRET environment variable is not set. Server cannot start.");
  process.exit(1);
}

app.use(cors());

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://zeek-prod.vercel.app/",
      "https://zeek-prod-den-5s-projects.vercel.app",
    ].filter(Boolean),
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/admin", adminRoutes);

mongoose
  .connect(process.env.DB_URL)
  .then(() => void (0))
  .catch((err) => {
    console.error("CRITICAL: MongoDB connection error:", err.message);
    process.exit(1);
  });

const server = http.createServer(app);

initializeWebSocket(server);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  void (0);
});
