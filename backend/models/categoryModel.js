const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    scope: {
      type: String,
      enum: ["product", "service"],
      required: true,
      index: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
      index: true,
    },
    parentSlug: { type: String, trim: true, lowercase: true, index: true },
    isSubcategory: { type: Boolean, default: false, index: true },
    overview: { type: String, trim: true },
    description: {
      short: { type: String, required: true, trim: true },
      detailed: { type: String, trim: true },
    },
    mediaAssets: [{ type: Schema.Types.ObjectId, ref: "MediaAsset" }],
    metadata: {
      status: {
        type: String,
        enum: ["active", "draft", "archived"],
        default: "active",
        index: true,
      },
      seo: {
        title: { type: String },
        description: { type: String },
        keywords: [String],
      },
      industryFocus: [String],
      displayOrder: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

// Pre-save hook to populate parentSlug
CategorySchema.pre("save", async function (next) {
  if (this.isSubcategory && this.parent) {
    try {
      const parentCategory = await mongoose
        .model("Category")
        .findById(this.parent, "slug");
      this.parentSlug = parentCategory ? parentCategory.slug : null;
      if (!parentCategory) {
        console.warn(`Parent category not found for subcategory ${this.title}`);
      }
    } catch (error) {
      console.error("Error in pre-save hook (Category):", error);
      return next(error);
    }
  } else {
    this.parentSlug = null;
  }
  next();
});

// Indexes
CategorySchema.index({
  parent: 1,
  "metadata.status": 1,
  "metadata.displayOrder": 1,
});
CategorySchema.index({ isSubcategory: 1, "metadata.status": 1 });
CategorySchema.index({
  title: "text",
  "description.short": "text",
  "metadata.industryFocus": "text",
});

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
