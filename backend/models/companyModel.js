const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    industryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Industry",
      required: false,
      index: true,
    },
    subscriptionPlan: {
      type: String,
      enum: ["free", "basic", "premium", "enterprise"],
      default: "free",
      index: true,
    },
    address: {
      street: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      postalCode: { type: String, required: true, trim: true },
      country: { type: String, required: true, trim: true },
      additionalInfo: { type: String, trim: true },
    },
    contact: {
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, "Invalid email format"],
      },
      phone: {
        type: String,
        trim: true,
        match: [/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"],
      },
      website: { type: String, trim: true },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "pending"],
      default: "pending",
      index: true,
    },
    maxUsers: { type: Number, default: 4 }, // Admin + 3 users
    additionalUsersCount: { type: Number, default: 0 }, // Tracks added users
    isSetupComplete: { type: Boolean, default: false }, // Setup status
    lockedFields: {
      // Pre-filled, unchangeable fields
      companyName: { type: Boolean, default: true },
      industryId: { type: Boolean, default: true },
    },
    metadata: {
      companySize: {
        type: String,
        enum: ["small", "medium", "large", "enterprise"],
      },
      employeeCount: { type: Number, min: 1 },
      onboardedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      subscriptionStartDate: { type: Date },
      subscriptionEndDate: { type: Date },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ... virtuals and indexes unchanged ...

// Pre-save hook
CompanySchema.pre("save", function (next) {
  if (
    this.subscriptionPlan !== "free" &&
    !this.metadata.subscriptionStartDate
  ) {
    this.metadata.subscriptionStartDate = new Date();
  }
  if (this.status === "active" && !this.contact.email) {
    throw new Error("Active companies must have an email");
  }
  if (this.isSetupComplete && !this.address.street) {
    throw new Error("Setup requires complete address");
  }
  next();
});

module.exports = mongoose.model("Company", CompanySchema);
