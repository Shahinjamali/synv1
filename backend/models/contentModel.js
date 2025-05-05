const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    section: {
      type: String,
      trim: true,
      index: true,
    },
    element: {
      type: String,
      trim: true,
    },
    contentRole: {
      type: String,
      enum: [
        "blog",
        "testimonial",
        "announcement",
        "faq",
        "review",
        "hero",
        "custom",
      ],
      default: "custom",
      index: true,
    },
    slug: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    locale: {
      type: String,
      enum: ["en", "fr", "tr", "de", "fa"],
      default: "en",
      index: true,
    },
    contentType: {
      type: String,
      required: true,
      enum: ["text", "rich-text", "image", "video", "link", "array", "json"],
      index: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator: function (v) {
          switch (this.contentType) {
            case "text":
            case "rich-text":
              return typeof v === "string";
            case "image":
            case "video":
            case "link":
              return typeof v === "string" && /^https?:\/\//.test(v);
            case "array":
              return Array.isArray(v);
            case "json":
              return typeof v === "object" && v !== null;
            default:
              return true;
          }
        },
        message: "Content must match the specified contentType",
      },
    },
    mediaAssets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MediaAsset",
      },
    ],
    metadata: {
      title: { type: String, trim: true },
      description: { type: String, trim: true },
      keywords: [{ type: String, trim: true, index: true }],
      author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      version: { type: Number, default: 1, min: 1 },
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived", "pending-review"],
      default: "draft",
      index: true,
    },
    visibility: {
      type: String,
      enum: ["public", "internal", "customer-only"],
      default: "public",
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to populate author info
contentSchema.virtual("contentAuthor", {
  ref: "User",
  localField: "metadata.author",
  foreignField: "_id",
  justOne: true,
});

// Compound index for fast filtering
contentSchema.index({ page: 1, section: 1, status: 1 }, { background: true });

// Text search index
contentSchema.index({
  "metadata.title": "text",
  "metadata.description": "text",
  "metadata.keywords": "text",
});

// Pre-save hook for default behaviors
contentSchema.pre("save", function (next) {
  if (this.contentType === "array" && !Array.isArray(this.content)) {
    this.content = [];
  }
  if (this.status === "published" && !this.metadata.title) {
    this.metadata.title = this.page;
  }
  next();
});

module.exports = mongoose.model("Content", contentSchema);
