const mongoose = require("mongoose");

const oilAnalysisSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    oilTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OilType",
      required: true,
    },
    source: { type: String, enum: ["sensor", "lab"], required: true },
    timestamp: { type: Date, required: true },
    parameters: [
      {
        name: { type: String, required: true }, // e.g., "pH", "TAN", "Viscosity", "Fe"
        value: { type: Number, required: true },
        unit: { type: String, required: true }, // e.g., "pH", "mgKOH/g", "cSt", "ppm"
      },
    ],
    isDeleted: { type: Boolean, default: false }, // ✅ Ensure default value
    labReport: { type: String }, // URL or text for lab reports
  },
  { timestamps: true, collection: "oilanalysis" } // ✅ Explicitly set collection name
);

module.exports = mongoose.model("OilAnalysis", oilAnalysisSchema);
