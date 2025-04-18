const mongoose = require("mongoose");

const SensorDataSchema = new mongoose.Schema(
  {
    sensorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor",
      required: true,
      index: true, // Individual index for sensor-specific queries
    },
    value: {
      type: Number,
      required: true,
      validate: {
        validator: Number.isFinite, // Ensure valid numbers
        message: "Value must be a finite number",
      },
    },
    unit: {
      type: String,
      required: true,
      enum: ["°C", "°F", "Hz", "psi", "ppm", "m/s²", "%", "other"], // Common units + fallback
      trim: true, // Clean input
    },
    metadata: {
      quality: {
        type: String,
        enum: ["good", "suspect", "error"], // Data quality flag
        default: "good",
      },
      source: {
        type: String,
        enum: ["raw", "processed", "manual"], // Origin of the reading
        default: "raw",
      },
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only createdAt, no updates expected
    collection: "sensorData", // Explicit collection name for clarity
  }
);

// Compound index for common queries (retained and expanded)
SensorDataSchema.index({ sensorId: 1, timestamp: -1 }, { background: true });

// TTL index for auto-expiration (optional, if expiresAt is set)
SensorDataSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Pre-save hook to validate consistency (example)
SensorDataSchema.pre("save", function (next) {
  if (this.unit === "other" && !this.metadata.customUnit) {
    this.metadata.customUnit = "unspecified"; // Fallback for custom units
  }
  next();
});

// Virtual to link back to sensor (optional)
SensorDataSchema.virtual("sensor", {
  ref: "Sensor",
  localField: "sensorId",
  foreignField: "_id",
  justOne: true,
});

module.exports = mongoose.model("SensorData", SensorDataSchema);
