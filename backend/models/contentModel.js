const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      index: true, // Fast lookups by page
      trim: true, // Clean input
      lowercase: true, // Normalize for consistency (e.g., "homepage" vs "HomePage")
    },
    section: {
      type: String,
      trim: true,
      index: true, // Filter by section efficiently
    },
    element: {
      type: String,
      trim: true, // e.g., "headline", "image"
    },
    contentType: {
      type: String,
      required: true, // Ensure type is always specified
      enum: [
        "text", // Plain text (e.g., headlines)
        "rich-text", // HTML/Markdown (e.g., blog content)
        "image", // Image URL
        "video", // Video URL
        "link", // Hyperlink
        "array", // List of items (e.g., product highlights)
        "json", // Structured data (e.g., custom widgets)
      ],
      index: true, // Filter by type efficiently
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true, // Ensure content is provided
      validate: {
        validator: function (v) {
          switch (this.contentType) {
            case "text":
            case "rich-text":
              return typeof v === "string";
            case "image":
            case "video":
            case "link":
              return typeof v === "string" && /^https?:\/\//.test(v); // Basic URL check
            case "array":
              return Array.isArray(v);
            case "json":
              return typeof v === "object" && v !== null;
            default:
              return true; // Fallback for future types
          }
        },
        message: "Content must match the specified contentType",
      },
    },
    metadata: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      keywords: [{ type: String, trim: true, index: true }], // Indexed for search
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Content creator
      version: { type: Number, default: 1, min: 1 }, // Track content revisions
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived", "pending-review"],
      default: "draft", // Start as draft for review
      index: true, // Filter by status efficiently
    },
    visibility: {
      type: String,
      enum: ["public", "internal", "customer-only"],
      default: "public", // Control access level
    },
    expiresAt: {
      type: Date, // TTL for temporary content (e.g., promotions)
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to populate author details
contentSchema.virtual("contentAuthor", {
  ref: "User",
  localField: "metadata.author",
  foreignField: "_id",
  justOne: true,
});

// Compound index for common queries
contentSchema.index({ page: 1, section: 1, status: 1 }, { background: true });

// Text index for search functionality
contentSchema.index({
  "metadata.title": "text",
  "metadata.description": "text",
  "metadata.keywords": "text",
});

// Pre-save hook for validation and defaults
contentSchema.pre("save", function (next) {
  if (this.contentType === "array" && !Array.isArray(this.content)) {
    this.content = []; // Default empty array
  }
  if (this.status === "published" && !this.metadata.title) {
    this.metadata.title = this.page; // Fallback title
  }
  next();
});

module.exports = mongoose.model("Content", contentSchema);
