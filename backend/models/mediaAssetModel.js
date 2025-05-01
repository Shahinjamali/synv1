const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MediaAssetSchema = new Schema(
  {
    type: {
      type: String,
      enum: [
        "image",
        "thumbnail",
        "icon",
        "banner",
        "productCard",
        "featureBlock",
        "verticalFeature",
        "heroHalf",
        "serviceCard",
        "wideBanner",
        "miniBanner",
        "document",
        "video",
      ],
      required: true,
      index: true,
    },
    url: { type: String, required: true }, // URL to the asset (e.g., S3, CDN)
    altText: { type: String }, // For images
    title: { type: String, required: true }, // Meaningful title (e.g., "ECOCOOL 68 CF - TDS English")
    description: { type: String }, // Optional description
    format: { type: String }, // e.g., "pdf", "jpg", "png", "mp4"
    size: { type: Number }, // File size in bytes
    language: { type: String, default: "en", index: true }, // ISO 639-1 code
    isPrimary: { type: Boolean, default: false }, // Is this the primary image/thumbnail for the owner?
    access: {
      // Access control for this specific asset
      type: String,
      enum: ["public", "authenticated", "subscriber", "restricted"],
      default: "public",
      index: true,
    },
    restrictedRoles: [String], // Specific roles needed if access is "restricted"
    metadata: {
      // Document specific fields
      documentType: {
        type: String,
        enum: [
          "TDS",
          "SDS",
          "PDS",
          "Certification",
          "Approval",
          "Brochure",
          "CaseStudy",
          "Guide",
          "Other",
        ],
        index: true,
      },
      version: { type: String }, // Document version (e.g., "v2.1")
      publicationDate: { type: Date }, // Official publish date of the document
      // Image specific fields
      dimensions: {
        width: { type: Number },
        height: { type: Number },
      },
      // Video specific fields
      duration: { type: Number }, // in seconds
    },
    owner: {
      // Link back to the owning document (Product or Category)
      type: {
        type: String,
        enum: ["product", "category", "service", "orphaned"],
      },
      id: { type: Schema.Types.ObjectId }, // References either Product or Category _id
    },
    tags: [String],
    status: {
      type: String,
      enum: ["orphaned", "assigned"],
      default: "orphaned", // Track whether the asset has an owner
      index: true,
    },
  },
  {
    timestamps: true, // Adds createdAt, updatedAt
    collection: "media",
  }
);

// Indexes
MediaAssetSchema.index({ "owner.type": 1, "owner.id": 1, type: 1 }); // Get all assets of a specific type for an owner
MediaAssetSchema.index({
  "owner.id": 1,
  "metadata.documentType": 1,
  language: 1,
}); // Find specific document type/language for an owner
MediaAssetSchema.index({ type: 1, access: 1 }); // General query by type and access level
MediaAssetSchema.index({ "metadata.documentType": 1, language: 1, access: 1 }); // Find documents by type/lang/access globally

const MediaAsset = mongoose.model("MediaAsset", MediaAssetSchema);
module.exports = MediaAsset;
