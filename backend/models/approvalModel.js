const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ApprovalSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g., "NSF H1", "MAN M 3477"
    authority: { type: String }, // e.g., "NSF International", "MAN Truck & Bus"
    certificateId: { type: String },
    url: { type: String }, // Link to certificate if available online
    region: { type: String }, // e.g., "Global", "EU", "North America"
    expiryDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "pending", "expired"],
      default: "active",
    },
    access: {
      type: String,
      enum: ["public", "authenticated", "subscriber"],
      default: "public",
    },
  },
  { _id: false }
);

module.exports = ApprovalSchema; // Export just the schema, not a model
