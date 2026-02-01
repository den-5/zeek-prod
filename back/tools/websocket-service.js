const WebSocket = require("ws");

let wss;

const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", (message) => {
      console.log(`Received message => ${message}`);
      // Handle incoming messages from clients
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};

// Function to broadcast messages to all connected clients
const notifyClients = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

module.exports = { initializeWebSocket, notifyClients };
