const mongoose = require("mongoose");

const ReliabilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    categoryPath: {
      type: [String], // e.g., ["reliabilitysolutions", "predictivemaintenance", "oilanalysis"]
      required: true,
      index: true,
    },
    description: {
      type: String,
      trim: true, // Detailed service description
    },
    features: [
      {
        name: { type: String, required: true, trim: true }, // e.g., "Real-time monitoring"
        details: { type: String, trim: true }, // e.g., "Uses advanced sensors"
      },
    ],
    applications: [
      {
        type: String,
        trim: true, // e.g., "Gearbox monitoring", "Pump diagnostics"
      },
    ],
    industrySectors: [
      {
        type: String,
        trim: true, // e.g., "Oil & Gas", "Manufacturing", "Energy"
      },
    ],
    technicalData: {
      sensorCompatibility: [{ type: String, trim: true }],
      analysisFrequency: { type: String, trim: true },
      otherProperties: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    safetyData: {
      tds: { type: String, trim: true },
      msds: { type: String, trim: true },
    },
    media: {
      images: [{ type: String, trim: true }],
      videos: [{ type: String, trim: true }],
      documents: [
        {
          fileName: { type: String, required: true, trim: true },
          fileType: {
            type: String,
            enum: ["pdf", "doc", "docx", "xls", "xlsx", "other"],
            required: true,
          },
          url: { type: String, required: true, trim: true },
          authorizationRequired: { type: Boolean, default: false },
          uploadDate: { type: Date, default: Date.now },
          description: { type: String, trim: true },
        },
      ],
    },
    sustainabilityData: {
      ecoFriendly: { type: Boolean, default: false },
      toleranceLevel: {
        type: String,
        enum: ["low", "medium", "high", "none"],
        default: "none",
      },
      lifespan: { type: Number, min: 0 },
      energySavings: { type: Number, min: 0 },
    },
    batchNumber: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isFinite,
        message: "Price must be a finite number",
      },
    },
    availableRegions: [
      {
        type: String,
        trim: true,
        enum: ["NA", "EU", "ASIA", "LATAM", "MEA", "Other"],
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        index: true, // e.g., "predictive", "diagnostics", "sensors"
      },
    ],
    authorizationRequired: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "discontinued", "out-of-stock", "pending"],
      default: "active",
    },
    platformData: {
      sensorIds: [{ type: String, trim: true }],
      digitalTwinId: { type: String, trim: true },
      lastAnalysis: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

ReliabilitySchema.virtual("creator", {
  ref: "User",
  localField: "createdBy",
  foreignField: "_id",
  justOne: true,
});

ReliabilitySchema.index(
  { name: "text", categoryPath: 1, tags: 1, industrySectors: 1 },
  { background: true }
);

ReliabilitySchema.pre("save", function (next) {
  if (this.sustainabilityData && !this.sustainabilityData.lifespan) {
    this.sustainabilityData.lifespan = null;
  }
  next();
});

module.exports = mongoose.model("Reliability", ReliabilitySchema);
