// src/models/serviceModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ServiceSchema = new Schema(
  {
    // --- Basic Info ---
    title: {
      type: String,
      required: [true, "Service title is required."],
      index: true,
      trim: true,
    },
    subtitle: { type: String, trim: true },
    tagline: { type: String, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // --- Categorization ---
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category", // Reuse same Category model as products
      required: [true, "Service category is required."],
      index: true,
    },
    categorySlug: { type: String, required: true, index: true },

    // --- Descriptions & Features ---
    overview: { type: String, trim: true },
    description: {
      short: { type: String, required: true, trim: true },
      detailed: { type: String, trim: true },
    },
    keyBenefits: [{ type: String, trim: true }],
    targetAudience: { type: String, trim: true },

    // --- Service Details ---
    methodology: { type: String, trim: true },
    deliverables: [
      {
        item: { type: String, required: true },
        format: { type: String },
        frequency: { type: String },
      },
    ],
    serviceLevels: [
      {
        name: { type: String, required: true },
        description: { type: String },
        featuresIncluded: [String],
      },
    ],
    parametersMonitored: [
      {
        parameter: { type: String, required: true },
        technology: { type: String },
        unit: { type: String },
      },
    ],
    technologyUsed: [String],
    duration: { type: String, trim: true },
    reportingDetails: {
      dashboardAccess: { type: Boolean, default: false },
      standardReports: [String],
      customReportingAvailable: { type: Boolean, default: false },
    },

    // --- Applicability ---
    applicableIndustries: [String],
    applicableEquipment: [String],
    prerequisites: [String],

    // --- Media & Visibility ---
    mediaAssets: [{ type: Schema.Types.ObjectId, ref: "MediaAsset" }],
    visibility: {
      isPublic: { type: Boolean, default: true },
      requiresAuth: { type: Boolean, default: false },
      restrictedRoles: [String],
    },

    // --- Metadata ---
    metadata: {
      status: {
        type: String,
        enum: ["active", "draft", "archived"],
        default: "active",
        index: true,
      },
      version: { type: String, default: "1.0.0" },
      internalCode: { type: String },
      tags: [String],
      relatedCaseStudies: [{ type: Schema.Types.ObjectId, ref: "MediaAsset" }],
      relatedProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    },
  },
  {
    timestamps: true,
    collection: "services",
  }
);

ServiceSchema.pre("save", async function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }

  if (this.isModified("category") || this.isNew) {
    try {
      const CategoryModel = mongoose.model("Category");
      const category = await CategoryModel.findById(this.category);
      if (!category) {
        return next(new Error(`Invalid service category ID: ${this.category}`));
      }
      this.categorySlug = category.slug;
    } catch (error) {
      console.error("Error fetching category for slug denormalization:", error);
      return next(error);
    }
  }
  next();
});

ServiceSchema.index({ slug: 1 });
ServiceSchema.index({ category: 1, "metadata.status": 1 });
ServiceSchema.index({ categorySlug: 1, "metadata.status": 1 });
ServiceSchema.index({ "metadata.tags": 1 });
ServiceSchema.index({ applicableIndustries: 1 });
ServiceSchema.index({ applicableEquipment: 1 });
ServiceSchema.index(
  {
    title: "text",
    subtitle: "text",
    tagline: "text",
    overview: "text",
    "description.short": "text",
    "metadata.tags": "text",
    applicableIndustries: "text",
    applicableEquipment: "text",
  },
  {
    weights: {
      title: 10,
      subtitle: 5,
      tagline: 5,
      "metadata.tags": 8,
      overview: 3,
      "description.short": 2,
      applicableIndustries: 4,
      applicableEquipment: 4,
    },
    name: "ServiceTextIndex",
  }
);

const Service = mongoose.model("Service", ServiceSchema);
module.exports = Service;
