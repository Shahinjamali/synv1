const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "create",
        "update",
        "delete",
        "login",
        "logout",
        "system",
        "access",
        "other",
        "sample_created",
        "sample_submitted",
        "results_received",
        "lab-report-added",
        "lab_report_created",
        "create_user",
        "update_user",
        "update_equipment",
      ],
      index: true,
    },
    entity: {
      entityType: {
        type: String,
        enum: [
          "User",
          "Company",
          "Product",
          "Service",
          "Sensor",
          "SensorData",
          "Report",
          "Order",
          "Notification",
          "Maintenance",
          "Industry",
          "Content",
          "AuditLog",
          "Other",
          "Lab",
          "Equipment",
        ],
        required: true,
      },
      entityId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: {},
    },
    metadata: {
      ipAddress: { type: String, trim: true },
      userAgent: { type: String, trim: true },
      context: { type: String, trim: true },
      previousState: { type: mongoose.Schema.Types.Mixed },
      newState: { type: mongoose.Schema.Types.Mixed },
    },
  },
  {
    timestamps: { createdAt: "loggedAt", updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AuditLogSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

AuditLogSchema.virtual("affectedEntity", {
  refPath: "entity.entityType",
  localField: "entity.entityId",
  foreignField: "_id",
  justOne: true,
});

AuditLogSchema.index(
  { userId: 1, action: 1, loggedAt: -1 },
  { background: true }
);
AuditLogSchema.index({ loggedAt: 1 }, { expireAfterSeconds: 31536000 });

AuditLogSchema.pre("save", function (next) {
  if (
    this.action === "update" &&
    (!this.metadata.previousState || !this.metadata.newState)
  ) {
    throw new Error(
      "Update actions must include previousState and newState in metadata"
    );
  }
  next();
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
