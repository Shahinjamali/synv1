const mongoose = require("mongoose");

const MaintenanceSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
      index: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    issue: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "resolved", "on-hold", "canceled"],
      default: "open",
      index: true,
    },
    predictiveAlerts: [
      {
        alertType: {
          type: String,
          enum: [
            "threshold-exceeded",
            "anomaly-detected",
            "failure-predicted",
            "custom",
          ],
          required: true,
        },
        threshold: { type: Number },
        valueAtTrigger: { type: Number },
        triggeredAt: { type: Date, required: true, default: Date.now },
        sensorId: { type: mongoose.Schema.Types.ObjectId, ref: "Sensor" },
      },
    ],
    maintenanceTasks: [
      {
        taskType: {
          type: String,
          enum: ["inspection", "repair", "replacement", "oil-change", "other"],
          required: true,
        },
        description: { type: String, trim: true },
        assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        scheduledDate: { type: Date },
        completedDate: { type: Date },
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed", "failed"],
          default: "pending",
        },
      },
    ],
    oilAnalysisResults: [
      {
        sampleId: { type: String, trim: true },
        sampleDate: { type: Date, required: true, default: Date.now },
        results: { type: mongoose.Schema.Types.Mixed, default: {} },
        analyzedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    sensorData: [{ type: mongoose.Schema.Types.ObjectId, ref: "SensorData" }],
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    resolution: {
      resolutionDate: { type: Date },
      resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      notes: { type: String, trim: true },
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

MaintenanceSchema.virtual("company", {
  ref: "Company",
  localField: "companyId",
  foreignField: "_id",
  justOne: true,
});

MaintenanceSchema.index(
  { companyId: 1, equipmentId: 1, status: 1 },
  { background: true }
);

MaintenanceSchema.pre("save", function (next) {
  if (this.status === "resolved" && !this.resolution.resolutionDate) {
    this.resolution.resolutionDate = new Date();
  }
  if (
    this.maintenanceTasks.some((task) => task.status === "completed") &&
    this.status === "open"
  ) {
    this.status = "in-progress";
  }
  next();
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
