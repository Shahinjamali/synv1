const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow system logs
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
        "sample_created", // Added for POST /sample
        "sample_submitted", // Added for PATCH /submit
        "results_received", // Added for PATCH /results
        "lab-report-added",
        "lab_report_created",
        "create_user", // Added
        "update_user", // Added
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
          "Lab", // Added for lab reports
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
      required: false, // Made optional for flexibility
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

// Virtuals
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

// Indexes
AuditLogSchema.index(
  { userId: 1, action: 1, loggedAt: -1 },
  { background: true }
);
// Optional TTL (1 year)
AuditLogSchema.index({ loggedAt: 1 }, { expireAfterSeconds: 31536000 });

// Pre-save hook adjustment
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
