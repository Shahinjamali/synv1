const mongoose = require("mongoose");

const InventorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true, // Link to product
    },
    batchNumber: {
      type: String,
      required: true,
      index: true, // Track specific batches (e.g., "BATCH-2025-001")
      trim: true,
    },
    location: {
      type: String,
      required: true,
      enum: [
        "NA-Warehouse",
        "EU-Warehouse",
        "ASIA-Warehouse",
        "LATAM-Warehouse",
        "MEA-Warehouse",
        "Other",
      ],
      index: true, // Filter by location
    },
    quantity: {
      type: Number,
      required: true,
      min: 0, // Prevent negative stock
      validate: {
        validator: Number.isInteger, // Ensure whole numbers
        message: "Quantity must be an integer",
      },
    },
    status: {
      type: String,
      enum: ["available", "reserved", "shipped", "expired", "quarantined"],
      default: "available", // Track inventory state
      index: true,
    },
    manufacturingDate: {
      type: Date,
      required: true, // For tracking lifecycle
    },
    expiryDate: {
      type: Date, // Shelf life of lubricants
    },
    metadata: {
      supplier: { type: String, trim: true }, // Source of the batch
      storageConditions: { type: String }, // e.g., "Store below 30°C"
      lastUpdatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who updated it
      qualityCheck: {
        status: { type: String, enum: ["pending", "passed", "failed"] },
        checkedAt: { type: Date },
      },
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to populate product details
InventorySchema.virtual("product", {
  ref: "Product",
  localField: "productId",
  foreignField: "_id",
  justOne: true,
});

// Compound index for common queries
InventorySchema.index(
  { productId: 1, batchNumber: 1, location: 1 },
  { unique: true, background: true }
);

// Pre-save hook for validation
InventorySchema.pre("save", function (next) {
  if (this.quantity === 0 && this.status === "available") {
    this.status = "shipped"; // Auto-update status if depleted
  }
  if (
    this.expiryDate &&
    this.expiryDate < new Date() &&
    this.status !== "expired"
  ) {
    this.status = "expired"; // Mark as expired if past date
  }
  next();
});

module.exports = mongoose.model("Inventory", InventorySchema);
