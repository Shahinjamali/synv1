const mongoose = require("mongoose");

const equipmentHealthSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
      unique: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    healthScore: { type: Number, min: 0, max: 100, default: 85 },
    oilStatus: {
      type: String,
      enum: ["good", "caution", "critical"],
      default: "good",
    },
    lastOilAnalysis: {
      timestamp: { type: Date },
      parameters: [{ name: String, value: Number, unit: String }],
      labReport: { type: String },
    },
    oilDetails: [
      // Changed to array
      {
        oilTypeId: { type: mongoose.Schema.Types.ObjectId, ref: "OilType" },
        brand: { type: String },
        fillDate: { type: Date },
        volume: { type: Number },
        operationalHours: { type: Number },
      },
    ],
    latestAlerts: [
      {
        message: String,
        severity: { type: String, enum: ["low", "medium", "high"] },
        parameter: String,
        value: Number,
        suggestion: String,
        timestamp: Date,
      },
    ],
    lastVibrationAnalysis: {
      timestamp: { type: Date },
      metrics: [{ name: String, value: Number, unit: String }],
    },
  },
  {
    timestamps: true,
    collection: "equipmenthealth",
  }
);

/**
 * ✅ Ensures equipmentId matches the new ObjectId structure
 * ✅ Preserves updateHealth() method logic while improving error handling
 */
equipmentHealthSchema.methods.updateHealth = async function () {
  try {
    const oilAnalysis = await mongoose
      .model("OilAnalysis")
      .find({ equipmentId: this.equipmentId })
      .sort({ timestamp: -1 })
      .limit(1);

    const alerts = await mongoose
      .model("Alert")
      .find({ equipmentId: this.equipmentId, isResolved: false })
      .sort({ timestamp: -1 })
      .limit(5);

    const equipment = await mongoose
      .model("Equipment")
      .findById(this.equipmentId)
      .populate("oilHistory.oilTypeId");

    this.lastOilAnalysis = oilAnalysis[0]
      ? {
          timestamp: oilAnalysis[0].timestamp,
          parameters: oilAnalysis[0].parameters,
          labReport:
            oilAnalysis[0].source === "lab"
              ? "Lab Report Available"
              : undefined,
        }
      : null;

    this.oilDetails =
      equipment && equipment.oilHistory.length > 0
        ? {
            oilTypeId: equipment.oilHistory[0].oilTypeId,
            brand: equipment.oilHistory[0].brand || "Unknown",
            fillDate: equipment.oilHistory[0].fillDate,
            volume: equipment.oilHistory[0].volume,
            operationalHours: equipment.operationalHours,
          }
        : null;

    this.latestAlerts = alerts.map((alert) => ({
      message: alert.message,
      severity: alert.severity,
      parameter: alert.parameter,
      value: alert.value,
      suggestion: alert.suggestion,
      timestamp: alert.timestamp,
    }));

    this.healthScore = 85 - alerts.length * 10;
    this.oilStatus =
      this.healthScore > 70
        ? "good"
        : this.healthScore > 40
        ? "caution"
        : "critical";
    if (this.healthScore < 0) this.healthScore = 0;

    // ✅ Ensure equipmentId is preserved before saving
    if (!this.equipmentId) {
      console.error(
        "updateHealth - equipmentId is null, this should not happen"
      );
      throw new Error("equipmentId cannot be null");
    }

    await this.save();
  } catch (error) {
    console.error("updateHealth - Error updating equipment health:", error);
    throw error;
  }
};

module.exports = mongoose.model("EquipmentHealth", equipmentHealthSchema);
