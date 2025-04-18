const mongoose = require("mongoose");

const labSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Equipment",
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    oilTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "OilType",
    },
    oilId: {
      type: mongoose.Schema.Types.ObjectId, // References _id of oilHistory subdocument in Equipment
      required: true,
      index: true,
    },
    sampleDate: {
      type: Date,
      required: true,
      default: Date.now, // When sample is taken
      index: true,
    },
    submissionDate: {
      type: Date,
      default: null, // When submitted to lab
    },
    resultsReceivedDate: {
      type: Date,
      default: null, // When results are recorded
    },
    parameters: [
      {
        name: { type: String, required: true },
        value: { type: Number, required: true },
        unit: { type: String, required: true },
        category: { type: String, required: true },
      },
    ], // Optional until results are added
    source: {
      type: String,
      enum: ["lab", "sensor"],
      required: true,
    },
    condition: {
      // Renamed from status to preserve oil health
      type: String,
      enum: ["good", "caution", "critical"],
      default: "good",
    },
    status: {
      // Workflow status
      type: String,
      enum: ["pending", "submitted", "completed"],
      default: "pending",
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.source === "lab";
      },
    },
    sensorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor",
      required: function () {
        return this.source === "sensor";
      },
    },
    notes: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook to validate oilId
labSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("oilId")) {
    try {
      const equipment = await mongoose.model("Equipment").findOne({
        _id: this.equipmentId,
        "oilHistory._id": this.oilId,
        "oilHistory.deletedAt": null,
      });
      if (!equipment) {
        return next(new Error("Invalid or deleted oilId in oilHistory"));
      }
    } catch (err) {
      return next(err);
    }
  }
  next();
});

module.exports = mongoose.model("Lab", labSchema);
