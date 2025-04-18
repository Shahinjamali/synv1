const mongoose = require("mongoose");

const KnowledgeBaseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      index: true, // Fast lookups by title
      trim: true, // Clean input
    },
    slug: {
      type: String,
      required: true,
      unique: true, // SEO-friendly URL identifier
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: true, // Rich text (e.g., HTML/Markdown)
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Maintenance Tips",
        "Lubricant Guides",
        "Predictive Analytics",
        "Oil Analysis",
        "Sustainability",
        "Technical Support",
        "Other",
      ],
      required: true,
      index: true, // Filter by category
    },
    tags: [
      {
        type: String,
        trim: true,
        index: true, // Enable tag-based searches
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Track who wrote it
      index: true,
    },
    visibility: {
      type: String,
      enum: ["public", "internal", "customer-only"],
      default: "public", // Control access
      index: true,
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived", "pending-review"],
      default: "draft", // Workflow status
      index: true,
    },
    metadata: {
      version: { type: Number, default: 1, min: 1 }, // Revision tracking
      relatedEntities: [
        {
          entityType: {
            type: String,
            enum: ["Product", "Service", "Industry", "Other"],
          },
          entityId: { type: mongoose.Schema.Types.ObjectId },
        },
      ], // Links to related items
      views: { type: Number, default: 0, min: 0 }, // Usage tracking
      lastReviewed: { type: Date }, // Maintenance of content
    },
    expiresAt: {
      type: Date, // TTL for temporary articles (e.g., announcements)
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to populate author details
KnowledgeBaseSchema.virtual("articleAuthor", {
  ref: "User",
  localField: "author",
  foreignField: "_id",
  justOne: true,
});

// Compound index for common queries
KnowledgeBaseSchema.index(
  { category: 1, status: 1, createdAt: -1 },
  { background: true }
);

// Text index for search functionality
KnowledgeBaseSchema.index({ title: "text", content: "text", tags: "text" });

// Pre-save hook for validation and slug generation
KnowledgeBaseSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""); // Generate slug from title
  }
  if (this.status === "published" && !this.metadata.lastReviewed) {
    this.metadata.lastReviewed = new Date(); // Set review date on publish
  }
  next();
});

module.exports = mongoose.model("KnowledgeBase", KnowledgeBaseSchema);
