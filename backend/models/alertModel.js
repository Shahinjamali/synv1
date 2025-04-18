const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    parameter: { type: String }, // e.g., "pH"
    value: { type: Number }, // e.g., 8.5
    timestamp: { type: Date, default: Date.now },
    suggestion: { type: String }, // e.g., "Check oil acidity"
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);
