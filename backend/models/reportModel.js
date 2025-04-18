const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "oil-analysis",
        "vibration-analysis",
        "predictive-maintenance",
        "oee-report",
        "failure-analysis",
        "custom",
      ],
      index: true,
    },
    labReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: false,
    },
    vibrationReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vibration",
      required: false,
    },
    generatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    generatedAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    insights: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["good", "caution", "critical"],
      default: "good",
    },
    reportFile: {
      type: String,
      trim: true,
    },
    metadata: {
      sources: [
        {
          type: { type: String, required: true }, // e.g., "lab", "vibration"
          refId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Links to LabModel or VibrationModel
        },
      ],
      exportFormat: {
        type: String,
        enum: ["pdf", "csv", "json", "other"],
        default: "pdf",
      },
      generatedDuration: { type: Number },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtuals (unchanged)
reportSchema.virtual("company", {
  ref: "Company",
  localField: "companyId",
  foreignField: "_id",
  justOne: true,
});

reportSchema.virtual("generator", {
  ref: "User",
  localField: "generatedBy",
  foreignField: "_id",
  justOne: true,
});

reportSchema.index(
  { companyId: 1, type: 1, generatedAt: -1 },
  { background: true }
);

reportSchema.pre("save", function (next) {
  if (this.type === "oil-analysis" && !this.labReportId) {
    throw new Error("Oil analysis reports require a labReportId");
  }
  next();
});

module.exports = mongoose.model("Report", reportSchema);
