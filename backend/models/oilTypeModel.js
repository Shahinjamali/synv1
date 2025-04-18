const mongoose = require("mongoose");

const oilTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true, // e.g., "Mobil 1 5W-30", "Lithium EP2"
    },
    brand: {
      type: String,
      required: true,
      trim: true, // e.g., "Mobil", "Shell"
    },
    type: {
      type: String,
      enum: ["neat", "water-mixable", "grease"],
      required: true,
    },
    properties: [
      {
        name: { type: String, required: true }, // e.g., "Viscosity @ 40°C", "pH", "Consistency"
        initialValue: { type: Number, default: 0 }, // Baseline value
        unit: { type: String, required: true }, // e.g., "cSt", "-", "NLGI"
        category: { type: String }, // Optional, no required flag
      },
    ],
    description: {
      type: String,
      trim: true, // Optional description
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft deletion
    },
  },
  { timestamps: true } // Adds createdAt, updatedAt
);

module.exports = mongoose.model("OilType", oilTypeSchema);
