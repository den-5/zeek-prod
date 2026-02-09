const WebSocket = require("ws");

let wss;

const initializeWebSocket = (server) => {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    void(0);

    ws.on("message", (message) => {
      void(0);
      
    });

    ws.on("close", () => {
      void(0);
    });
  });
};

const notifyClients = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

module.exports = { initializeWebSocket, notifyClients };
