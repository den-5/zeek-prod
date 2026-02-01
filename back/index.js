require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user"); // Import user routes
const gamesRoutes = require("./routes/games"); // Import games routes
const adminRoutes = require("./routes/admin"); // Import admin routes
const bodyParser = require("body-parser");
const http = require("http");
const { initializeWebSocket } = require("./tools/websocket-service"); // Import WebSocket initialization

const app = express();

// Validate required environment variables
if (!process.env.DB_URL) {
  console.error("CRITICAL: DB_URL environment variable is not set. Server cannot start.");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("CRITICAL: JWT_SECRET environment variable is not set. Server cannot start.");
  process.exit(1);
}

app.use(cors());
// Allow specific origin(s)
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "https://zeek-prod.vercel.app/",
      "https://zeek-prod-den-5s-projects.vercel.app",
    ].filter(Boolean),
  })
);

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use user routes
app.use("/api/user", userRoutes);
app.use("/api/games", gamesRoutes);
app.use("/api/admin", adminRoutes);

mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("CRITICAL: MongoDB connection error:", err.message);
    process.exit(1);
  });

const server = http.createServer(app);

// Initialize WebSocket server
initializeWebSocket(server);

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
