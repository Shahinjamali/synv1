const { z } = require("zod");
const { mediaAssetSchema } = require("./mediaAssetSchema");

// Unwrap the original shape
const raw = mediaAssetSchema._def.shape();

// Build a partial version of metadata
const metadataForm = raw.metadata.partial().extend({
  documentType: z
    .enum([
      "TDS",
      "SDS",
      "PDS",
      "Certification",
      "Approval",
      "Brochure",
      "CaseStudy",
      "Guide",
      "Other",
    ])
    .optional(),
  version: z.string().optional(),
  publicationDate: z.string().optional(),
  dimensions: z
    .object({ width: z.number().optional(), height: z.number().optional() })
    .optional(),
  duration: z.number().optional(),
});

// Now safely rebuild the form schema
const mediaAssetFormSchema = z.object({
  type: raw.type, // Keep type required
  title: raw.title, // Keep title required
  altText: raw.altText.optional(),
  description: raw.description.optional(),
  language: raw.language.optional(),
  access: raw.access.optional(),
  restrictedRoles: raw.restrictedRoles.optional(),
  tags: raw.tags.optional(),
  metadata: metadataForm.optional(), // Custom optional metadata
  isPrimary: raw.isPrimary.optional(),
  // We don't enforce owner or url yet at upload stage
});

module.exports = { mediaAssetFormSchema };
