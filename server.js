import { WebSocketServer } from "ws";
import http from "http";

// Passenger définit automatiquement le port via process.env.PORT
const server = http.createServer();
const wss = new WebSocketServer({ server });

console.log("WebSocket server is running...",server);

const clients = new Set();

wss.on("connection", ws => {
  clients.add(ws);
  ws.on("message", msg => {
    for (const client of clients) {
      if (client !== ws && client.readyState === 1) {
        client.send(msg.toString());
      }
    }
  });

  ws.on("close", () => clients.delete(ws));
});

server.listen(process.env.PORT || 3001);