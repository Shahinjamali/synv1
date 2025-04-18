// backend/models/NotificationModel.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: function () {
        return [
          "lab-alert",
          "sensor-alert",
          "system-equipment",
          "system-equipment-status",
        ].includes(this.type);
      },
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
      index: true,
    },
    oilTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OilType",
      required: false, // Optional, but necessary for filtering
      index: true,
    },
    oilName: {
      type: String,
      required: false, // To allow filtering by oil name
    },
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lab",
      required: function () {
        return this.type === "lab-alert";
      },
    },
    sensorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor",
      required: function () {
        return this.type === "sensor-alert";
      },
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return ["user-assigned", "user-task"].includes(this.type);
      },
    },
    type: {
      type: String,
      required: true,
      enum: [
        "lab-alert",
        "sensor-alert",
        "system-equipment",
        "system-equipment-status",
        "system-maintenance",
        "user-assigned",
        "user-task",
        "system-update",
        "sample-created",
        "sample-submitted",
        "results-received",
        "lab-report-added",
      ],
      index: true,
    },
    shortMessage: {
      type: String,
      required: true,
      trim: true,
    },
    detailedMessage: {
      type: String,
      required: true,
      trim: true,
    },
    relatedData: {
      entityType: {
        type: String,
        enum: [
          "oil-analysis",
          "sensor-analysis",
          "equipment",
          "maintenance-task",
        ],
      },
      entityId: { type: mongoose.Schema.Types.ObjectId },
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    sentAt: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
    metadata: {
      sender: {
        type: String,
        enum: ["system", "user", "automated"],
        default: "system",
      },
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      actionUrl: { type: String, trim: true },
      threshold: { type: Number },
      unit: { type: String, trim: true },
    },
    expiresAt: {
      type: Date,
    },
    parameter: { type: String },
    value: { type: Number },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
