const mongoose = require("mongoose");

const SensorSchema = new mongoose.Schema(
  {
    sensorId: {
      type: String,
      required: true,
      unique: true, // Ensure uniqueness across all sensors
      index: true, // Optimize lookups
      trim: true, // Clean input
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
      index: true, // Speed up location-based queries
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true, // Tie sensors to a company for Synix’s client focus
      index: true, // Optimize company-specific queries
    },
    equipmentId: {
      type: String,
      required: true, // Link to specific equipment
      index: true, // Fast lookups by equipment
    },
    type: {
      type: String,
      required: true,
      enum: [
        "vibration",
        "temperature",
        "pressure",
        "oil-quality",
        "humidity",
        "other", // Flexible for future types
      ],
      index: true, // Filter by type efficiently
    },
    manufacturer: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    installationDate: {
      type: Date,
      default: Date.now, // Default to now if not specified
    },
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance", "faulty"],
      default: "active", // Track operational state
    },
    metadata: {
      serialNumber: { type: String, unique: true, sparse: true }, // Optional unique identifier
      calibrationDate: { type: Date }, // Last calibration
      supportedUnits: [{ type: String }], // e.g., ["°C", "°F"]
    },
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
      index: true,
    },
    location: {
      type: String,
      trim: true,
      match: [
        /^[a-zA-Z0-9\s-]+$/,
        "Location must be alphanumeric with spaces or hyphens",
      ],
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to link sensor data (optional)
SensorSchema.virtual("latestData", {
  ref: "SensorData",
  localField: "_id",
  foreignField: "sensorId",
  justOne: true,
  options: { sort: { timestamp: -1 } }, // Get most recent reading
});

// Pre-save hook for validation (example)
SensorSchema.pre("save", function (next) {
  if (!this.manufacturer && this.status === "active") {
    this.status = "inactive"; // Ensure inactive if manufacturer missing
  }
  next();
});

// Compound index for common queries
SensorSchema.index({ companyId: 1, equipmentId: 1, type: 1 });

module.exports = mongoose.model("Sensor", SensorSchema);
