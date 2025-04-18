const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true, // Unique identifier for each order
      index: true, // Fast lookups
      default: () => `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Auto-generated
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Optimize user-specific queries
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true, // Optimize company-specific queries
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1, // Prevent invalid quantities
          validate: {
            validator: Number.isInteger, // Ensure whole numbers
            message: "Quantity must be an integer",
          },
        },
        batchNumber: {
          type: String,
          required: false, // Optional, tied to product tracking
          index: true, // Track specific batches
        },
        unitPrice: {
          type: Number,
          required: true,
          min: 0, // Snapshot of price at order time
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isFinite, // Ensure valid numbers
        message: "Total price must be a finite number",
      },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      index: true, // Filter by payment status
    },
    shippingAddress: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      additionalInfo: { type: String, trim: true }, // Optional instructions
    },
    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
      index: true, // Optimize date-based queries
    },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "canceled",
        "returned",
      ],
      default: "pending",
      index: true, // Filter by order status
    },
    tracking: {
      trackingNumber: { type: String, trim: true },
      carrier: { type: String, trim: true }, // e.g., "UPS", "FedEx"
      estimatedDelivery: { type: Date },
    },
    metadata: {
      paymentMethod: { type: String }, // e.g., "credit_card", "invoice"
      orderNotes: { type: String, trim: true }, // Customer notes
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional for manual orders
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to populate user details
orderSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Virtual to populate company details
orderSchema.virtual("company", {
  ref: "Company",
  localField: "companyId",
  foreignField: "_id",
  justOne: true,
});

// Compound index for common queries
orderSchema.index(
  { companyId: 1, status: 1, orderDate: -1 },
  { background: true }
);

// Pre-save hook for validation and totalPrice calculation
orderSchema.pre("save", function (next) {
  // Recalculate totalPrice based on items
  this.totalPrice = this.items.reduce((sum, item) => {
    return sum + (item.quantity * item.unitPrice || 0);
  }, 0);

  // Update status based on payment
  if (this.paymentStatus === "paid" && this.status === "pending") {
    this.status = "processing";
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
