const io = require("socket.io-client");
const socket = io("http://localhost:5000");

socket.on("connect", () => console.log("🟢 Connected:", socket.id));
socket.on("connect_error", (err) => console.error("❌ Error:", err.message));
socket.on("disconnect", () => console.log("🔴 Disconnected"));
