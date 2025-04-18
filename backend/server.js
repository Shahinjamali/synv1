require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const http = require("http");
const { protect, authorize } = require("./middlewares/authMiddleware");
const errorHandler = require("./middlewares/error");
const { initializeSocket } = require("./sockets/socket");
const cookieParser = require("cookie-parser");

// Import routes
const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const productRoutes = require("./routes/productRoutes");
console.log("🔵 Imported productRoutes:", typeof productRoutes);
const serviceRoutes = require("./routes/serviceRoutes");
const industryRoutes = require("./routes/industryRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const sensorDataRoutes = require("./routes/sensorDataRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const auditLogRoutes = require("./routes/auditLogRoutes");
const contentRoutes = require("./routes/contentRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const knowledgeBaseRoutes = require("./routes/knowledgeBaseRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const reliabilityRoutes = require("./routes/reliabilityRoutes");
const authRoutes = require("./routes/authRoutes");
const oilAnalysisRoutes = require("./routes/oilAnalysisRoutes");
const alertRoutes = require("./routes/alertRoutes");
const oilTypes = require("./routes/oilTypesRoutes");
const labRoutes = require("./routes/labRoutes");
const oilParameterRoutes = require("./routes/oilParameterRoutes");
const oilTrends = require("./routes/trendsRoutes");
const content = require("./routes/contentRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const contactRoutes = require("./routes/contactRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server); // Initialize WebSocket server

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Expires",
      "Cache-Control",
      "Pragma",
    ],
  })
);
app.options("*", cors());
app.use(morgan("dev"));
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cookieParser());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Mount Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/companies", protect, companyRoutes);
app.use("/api/products", productRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/industries", industryRoutes);
app.use("/api/sensors", protect, sensorRoutes);
app.use("/api/sensordata", protect, sensorDataRoutes);
app.use("/api/maintenance", protect, maintenanceRoutes);
app.use("/api/orders", protect, orderRoutes);
app.use("/api/reports", protect, reportRoutes);
app.use("/api/notifications", protect, notificationRoutes);
app.use("/api/auditlogs", protect, auditLogRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/inventory", protect, inventoryRoutes);
app.use("/api/knowledgebase", knowledgeBaseRoutes);
app.use("/api/equipment", protect, equipmentRoutes);
app.use("/api/reliability", reliabilityRoutes);
app.use("/api/oil-analysis", protect, oilAnalysisRoutes);
app.use("/api/alerts", protect, alertRoutes);
app.use("/api/oil-types", protect, oilTypes);
app.use("/api/lab-reports", protect, labRoutes);
app.use("/api/oil-parameter-types", protect, oilParameterRoutes);
app.use("/api/trends", protect, oilTrends);
app.use("/api/content", protect, content);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/public", contactRoutes);
app.use("/api/categories", categoryRoutes);
// Serve Frontend in Production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/out")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../frontend/out", "index.html"))
  );
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// Make io available to the app
app.set("io", io);

// Test Endpoint
app.get("/api/data", (req, res) => {
  res.json({ message: "Data from SYNIX backend on port 5000" });
});

// Global Error Handler
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});

// Graceful Shutdown
const shutDown = async () => {
  console.log("🛑 Received shutdown signal, closing server...");
  server.close(async () => {
    console.log("✅ HTTP server closed.");
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);
