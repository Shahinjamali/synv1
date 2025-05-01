const { z } = require("zod");

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),
  slug: z.string().min(1, "Slug is required"),
  category: z.string().min(1, "Category is required"),
  subcategory: z.string().min(1, "Subcategory is required"),
  categorySlug: z
    .string()
    .optional()
    .refine((val) => !val || val.length > 0, {
      message: "Category slug is required",
    }),
  subcategorySlug: z
    .string()
    .optional()
    .refine((val) => !val || val.length > 0, {
      message: "Subcategory slug is required",
    }),
  overview: z.string().optional(),
  description: z
    .object({
      short: z.string().min(1, "Short description is required"),
      detailed: z.string().optional(),
    })
    .optional(),
  keyFeatures: z.array(z.string()).optional(),
  applications: z.array(z.string()).optional(),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, "Key is required"),
        value: z.union([z.string(), z.number()]),
        unit: z.string().optional(),
        testMethod: z.string().optional(),
        standard: z.string().optional(),
      })
    )
    .optional(),
  approvals: z
    .array(
      z.object({
        name: z.string().min(1, "Name is required"),
        issuer: z.string().min(1, "Issuer is required"),
        status: z.enum(["active", "pending", "expired"]),
        certificateNumber: z.string().optional(),
        validUntil: z.string().optional(),
      })
    )
    .optional(),
  packaging: z
    .array(
      z.object({
        type: z.string().min(1, "Type is required"),
        size: z.number().min(0, "Size must be non-negative"),
        unit: z.string().min(1, "Unit is required"),
        sku: z.string().optional(),
        partNumber: z.string().optional(),
        availability: z
          .enum(["in_stock", "out_of_stock", "on_request"])
          .optional(),
      })
    )
    .optional(),
  compatibility: z
    .array(
      z.object({
        type: z.enum(["material", "seal", "coolant", "paint"]),
        name: z.string().min(1, "Name is required"),
        rating: z.enum([
          "excellent",
          "good",
          "fair",
          "poor",
          "not_recommended",
          "test_required",
        ]),
        notes: z.string().optional(),
      })
    )
    .optional(),
  compliance: z
    .object({
      reachCompliant: z.boolean().optional(),
      reachStatus: z.string().optional(),
      rohsCompliant: z.boolean().optional(),
      vocContent: z
        .object({
          value: z.number().optional(),
          unit: z.string().optional(),
          testMethod: z.string().optional(),
        })
        .optional(),
      ghs: z
        .object({
          classification: z.string().optional(),
          signalWord: z.string().optional(),
          pictograms: z.array(z.string()).optional(),
        })
        .optional(),
      halalCertified: z.boolean().default(false),
      kosherCertified: z.boolean().default(false),
    })
    .optional(),
  relatedProducts: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        relationshipType: z.enum([
          "alternative",
          "complementary",
          "upgrade",
          "downgrade",
          "required_accessory",
          "previous_version",
          "next_version",
        ]),
      })
    )
    .optional(),
  mediaAssets: z.array(z.string()).optional(),
  visibility: z
    .object({
      isPublic: z.boolean().default(true),
      requiresAuth: z.boolean().default(false),
      requiresSubscription: z.boolean().default(false),
      restrictedRoles: z.array(z.string()).optional(),
    })
    .optional(),
  metadata: z
    .object({
      status: z
        .enum(["active", "draft", "archived", "discontinued"])
        .default("active"),
      version: z.string().default("1.0.0"),
      internalCode: z.string().optional(),
      replacesProduct: z.string().optional(),
      replacedByProduct: z.string().optional(),
      seo: z
        .object({
          title: z.string().optional(),
          description: z.string().optional(),
          keywords: z.array(z.string()).optional(),
        })
        .optional(),
      tags: z.array(z.string()).optional(),
    })
    .optional(),
});

module.exports = { productSchema };
