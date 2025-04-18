const { Server } = require("socket.io");
const configureSocket = require("../utils/configureSocket"); // Import socket configuration
const OilAnalysis = require("../models/oilAnalysisModel");

let io;
const connectedClients = new Map(); // Store connected clients

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Expires",
        "Cache-Control",
        "Pragma",
      ],
    },
    pingTimeout: 60000,
    allowEIO3: true,
  });

  // Initialize domain-specific socket features (e.g., Oil Analysis events)
  configureSocket(io, { OilAnalysis });

  // Handle WebSocket connections
  io.on("connection", (socket) => {
    console.log(`✅ New WebSocket Connection: ${socket.id}`);

    // Register user for targeted notifications
    socket.on("registerUser", (userId) => {
      connectedClients.set(userId, socket);
      console.log(`👤 User Registered: ${userId}`);
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log(`❌ User Disconnected: ${socket.id}`);
      for (let [key, value] of connectedClients) {
        if (value === socket) connectedClients.delete(key);
      }
    });
  });

  return io; // Return the io instance for use in server.js
}

// Function to send a notification to a specific user
function sendNotification(userId, notification) {
  const socket = connectedClients.get(userId);
  if (socket) {
    socket.emit("newNotification", notification);
    console.log(`📢 Sent real-time notification to user: ${userId}`);
  }
}

// Function to send batched notifications to all connected clients
function emitNotificationBatch(notificationsArray) {
  if (!io) {
    console.error("❌ WebSocket server is not initialized!");
    return;
  }
  console.log(`📢 Sending ${notificationsArray.length} notifications`);
  io.emit("newNotifications", notificationsArray);
}

module.exports = { initializeSocket, sendNotification, emitNotificationBatch };
