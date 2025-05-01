// src/models/productModel.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SpecificationSchema = require("./specificationModel");
const ApprovalSchema = require("./approvalModel");
const ProductSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    tagline: { type: String, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categorySlug: { type: String, required: true, index: true }, // Denormalized
    subcategorySlug: { type: String, required: true, index: true }, // Denormalized
    overview: { type: String, trim: true },
    description: {
      short: { type: String, required: true, trim: true },
      detailed: { type: String, trim: true },
    },
    keyFeatures: [{ type: String, trim: true }],
    applications: [{ type: String, trim: true }],
    specifications: [SpecificationSchema],
    approvals: [ApprovalSchema],
    packaging: [
      {
        type: { type: String, required: true }, // e.g., "Drum", "Pail", "IBC", "Cartridge"
        size: { type: Number, required: true }, // e.g., 200, 20, 1000, 0.4
        unit: { type: String, required: true }, // e.g., "L", "kg", "mL"
        sku: { type: String, unique: true, sparse: true }, // Product variant SKU
        partNumber: { type: String },
        availability: {
          type: String,
          enum: ["in_stock", "out_of_stock", "on_request"],
        },
      },
    ],
    compatibility: [
      // Can be expanded based on specific needs
      {
        type: {
          type: String,
          enum: ["material", "seal", "coolant", "paint"],
          required: true,
        },
        name: { type: String, required: true }, // e.g., "Aluminum", "NBR Seal", "Emulsion XYZ"
        rating: {
          type: String,
          enum: [
            "excellent",
            "good",
            "fair",
            "poor",
            "not_recommended",
            "test_required",
          ],
        },
        notes: { type: String },
      },
    ],
    compliance: {
      reachCompliant: { type: Boolean },
      reachStatus: { type: String }, // e.g., 'Registered', 'Pre-registered', 'Exempt', 'SVHC free'
      rohsCompliant: { type: Boolean },
      vocContent: { value: Number, unit: String, testMethod: String },
      ghs: {
        classification: { type: String }, // e.g., "Not classified as hazardous" or specific H-statements
        signalWord: { type: String },
        pictograms: [String], // Codes or URLs to pictograms
      },
      halalCertified: { type: Boolean, default: false },
      kosherCertified: { type: Boolean, default: false },
      // Add other region-specific or industry-specific compliance data
    },
    relatedProducts: [
      // NEW Section
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        relationshipType: {
          type: String,
          enum: [
            "alternative",
            "complementary",
            "upgrade",
            "downgrade",
            "required_accessory",
            "previous_version",
            "next_version",
          ],
          required: true,
        },
      },
    ],
    mediaAssets: [{ type: Schema.Types.ObjectId, ref: "MediaAsset" }],
    visibility: {
      // Fine-grained access control
      isPublic: { type: Boolean, default: true }, // Visible to anonymous users
      requiresAuth: { type: Boolean, default: false }, // Visible only to logged-in users
      requiresSubscription: { type: Boolean, default: false }, // Visible only to specific subscription tiers
      restrictedRoles: [String], // Visible only to users with these roles (e.g., ["distributor", "oem_partner"])
    },
    metadata: {
      status: {
        type: String,
        enum: ["active", "draft", "archived", "discontinued"],
        default: "active",
        index: true,
      },
      version: { type: String, default: "1.0.0" }, // Product data version
      internalCode: { type: String }, // Company internal product code
      replacesProduct: { type: Schema.Types.ObjectId, ref: "Product" }, // Link to product this one replaces
      replacedByProduct: { type: Schema.Types.ObjectId, ref: "Product" }, // Link to product replacing this one
      seo: {
        title: { type: String },
        description: { type: String },
        keywords: [String],
      },
      tags: [String], // General purpose tags for filtering/search
    },
  },
  {
    timestamps: true,
    collection: "products",
  }
);

// Pre-save hook for validation and denormalization (ensure it still works with revised Category schema)
ProductSchema.pre("save", async function (next) {
  if (
    this.isNew ||
    this.isModified("category") ||
    this.isModified("subcategory")
  ) {
    try {
      const CategoryModel = mongoose.model("Category"); // Use the correct model name
      const category = await CategoryModel.findById(this.category);
      const subcategory = await CategoryModel.findById(this.subcategory);

      if (!category)
        return next(new Error(`Invalid category ID: ${this.category}`));
      if (!subcategory)
        return next(new Error(`Invalid subcategory ID: ${this.subcategory}`));
      if (subcategory.parent?.toString() !== this.category.toString()) {
        return next(
          new Error(
            `Subcategory '${subcategory.title}' (ID: ${this.subcategory}) does not belong to the specified category '${category.title}' (ID: ${this.category})`
          )
        );
      }
      if (!subcategory.isSubcategory) {
        return next(
          new Error(
            `Referenced subcategory '${subcategory.title}' (ID: ${this.subcategory}) is not marked as a subcategory.`
          )
        );
      }

      this.categorySlug = category.slug;
      this.subcategorySlug = subcategory.slug;
    } catch (error) {
      console.error("Error during product pre-save hook:", error);
      return next(error);
    }
  }
  next();
});

// Indexes (Review and add based on query patterns)

ProductSchema.index({ category: 1, subcategory: 1, "metadata.status": 1 }); // Core filtering by category structure
ProductSchema.index({
  categorySlug: 1,
  subcategorySlug: 1,
  "metadata.status": 1,
}); // Core filtering by slugs
ProductSchema.index({ "metadata.tags": 1 });
ProductSchema.index({ "approvals.name": 1, "approvals.status": 1 });
ProductSchema.index({ "applications.industry": 1 });
ProductSchema.index({ "properties.foodGrade": 1 });
ProductSchema.index({ "compliance.reachCompliant": 1 });
ProductSchema.index({ "compliance.rohsCompliant": 1 });
ProductSchema.index({ "relatedProducts.productId": 1 });
ProductSchema.index({
  title: "text",
  "description.short": "text",
  "metadata.tags": "text",
  tagline: "text",
}); // Enhanced text search
ProductSchema.index({ "metadata.updatedAt": -1 }); // Sorting by recent updates
ProductSchema.index({ "metadata.internalCode": 1 }); // If lookup by internal code is needed

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
