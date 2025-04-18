const io = require("socket.io-client");
const socket = io("http://localhost:5000");

socket.on("connect", () => console.log("🟢 Simulator connected:", socket.id));
socket.on("connect_error", (err) =>
  console.error("❌ Connection error:", err.message)
);
socket.on("disconnect", () => console.log("🔴 Simulator disconnected"));

setInterval(() => {
  const sensorData = {
    sensorId: "temp-001",
    temperature: (Math.random() * 10 + 20).toFixed(2),
    humidity: (Math.random() * 10 + 40).toFixed(2),
    timestamp: new Date().toISOString(),
  };
  console.log("📡 Sending Sensor Data:", sensorData);
  socket.emit("sensorData", sensorData);
}, 2000);
