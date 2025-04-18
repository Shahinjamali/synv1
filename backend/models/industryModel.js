const mongoose = require("mongoose");

const industrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true, // Ensure no duplicate industries
      index: true, // Fast lookups by name
      trim: true, // Clean input
    },
    description: {
      type: String,
      trim: true,
    },
    subIndustries: [
      {
        type: String,
        trim: true, // e.g., "Automotive Manufacturing" under "Manufacturing"
        index: true, // Enable sub-industry searches
      },
    ],
    solutions: [
      {
        solutionType: {
          type: String,
          enum: ["Product", "Service"],
          required: true, // Specify if it’s a product or service
        },
        solutionId: {
          type: mongoose.Schema.Types.ObjectId,
          refPath: "solutions.solutionType", // Dynamic ref to Product or Service
          required: true,
        },
        applicability: {
          type: String,
          trim: true, // e.g., "High-temperature environments"
        },
      },
    ],
    tags: [
      {
        type: String,
        trim: true, // e.g., "energy-efficient", "heavy-duty"
        index: true, // Support tag-based filtering
      },
    ],
    metadata: {
      marketSize: { type: Number, min: 0 }, // e.g., industry market value in millions
      keyChallenges: [{ type: String, trim: true }], // e.g., "equipment downtime"
      synixImpact: { type: String, trim: true }, // e.g., "Reduced downtime by 20%"
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active", // Track industry focus
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual to populate solutions dynamically
industrySchema.virtual("resolvedSolutions", {
  refPath: "solutions.solutionType",
  localField: "solutions.solutionId",
  foreignField: "_id",
});

// Compound index for common queries
industrySchema.index({ name: 1, status: 1 }, { background: true });

// Text index for search functionality
industrySchema.index({
  name: "text",
  description: "text",
  subIndustries: "text",
  tags: "text",
});

// Pre-save hook for validation (example)
industrySchema.pre("save", function (next) {
  if (
    this.solutions.length > 0 &&
    !this.solutions.every((s) => s.solutionType && s.solutionId)
  ) {
    throw new Error("Each solution must have a solutionType and solutionId");
  }
  next();
});

module.exports = mongoose.model("Industry", industrySchema);
