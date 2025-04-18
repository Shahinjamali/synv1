const mongoose = require("mongoose");

const oilParameterSchema = new mongoose.Schema(
  {
    oilType: {
      type: String,
      required: true,
      enum: ["neat", "water-mixable", "grease"], // Expandable later
      index: true,
    },
    parameters: [
      {
        name: { type: String, required: true },
        unit: { type: String, required: true },
        category: { type: String, required: true },
        defaultValue: { type: Number, default: 0 },
        threshold: {
          min: { type: Number },
          max: { type: Number },
        },
      },
    ],
    isCustom: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Prevent overwrite by checking if model exists
module.exports =
  mongoose.models.OilParameter ||
  mongoose.model("oilParameter", oilParameterSchema);
