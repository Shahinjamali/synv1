// File: models/equipmentModel.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["oil_change", "maintenance", "vibration_anomaly", "failure"],
    required: true,
  },
  timestamp: { type: Date, required: true, default: Date.now },
  details: { type: String }, // e.g., "Oil replaced with Mobil 1"
  impactOnHealth: { type: Number, default: 0 }, // e.g., +10 for maintenance, -20 for anomaly
});

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    type: { type: String },
    location: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    oilHistory: [
      {
        oilTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "OilType" },
        brand: { type: String },
        name: { type: String },
        oilType: {
          type: String,
          enum: ["neat", "water-mixable", "grease"],
          required: true,
        },
        fillDate: { type: Date, required: true },
        volume: { type: Number },
        notes: { type: String },
        application: { type: String },
        deletedAt: { type: Date, default: null },
        healthScore: { type: Number, min: 0, max: 100, default: 100 }, // Oil health (0-100%)
        lastHealthUpdate: { type: Date }, // When health was last computed
        labReports: [
          // New field added
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lab",
          },
        ],
      },
    ],
    oilChangeHistory: [
      {
        oilTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "OilType" },
        brand: { type: String },
        name: { type: String },
        oilType: {
          type: String,
          enum: ["neat", "water-mixable", "grease"],
          required: true,
        },
        fillDate: { type: Date },
        volume: { type: Number },
        notes: { type: String },
        application: { type: String },
        replacedAt: { type: Date, required: true },
        healthScore: { type: Number, min: 0, max: 100 }, // Final health at replacement
      },
    ],
    events: [eventSchema], // Log of significant events
    healthScore: { type: Number, min: 0, max: 100, default: 100 }, // Overall equipment health
    lastHealthUpdate: { type: Date }, // When equipment health was last computed
    operationalHours: { type: Number, default: 0 },
    hoursPerDay: { type: Number, default: 8 },
    section: { type: String },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
