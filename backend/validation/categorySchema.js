const { z } = require("zod");

const isValidObjectId = (val) => /^[0-9a-fA-F]{24}$/.test(val);

const categorySchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    subtitle: z.string().optional(),
    tagline: z.string().optional(),
    slug: z.string().min(1, "Slug is required"),
    scope: z.enum(["product", "service"]),
    isSubcategory: z.boolean().default(false),
    parent: z
      .string()
      .optional()
      .refine((val) => !val || isValidObjectId(val), {
        message: "Parent must be a valid 24-character hex string or empty",
      }),
    parentSlug: z.string().optional(),
    overview: z.string().optional(),
    keyFeatures: z.array(z.string()).optional(),
    applications: z.array(z.string()).optional(),
    description: z
      .object({
        short: z.string().min(1, "Short description is required"),
        detailed: z.string().optional(),
      })
      .optional(),
    mediaAssets: z.array(z.string()).optional(),
    metadata: z
      .object({
        status: z.enum(["active", "draft", "archived"]).default("active"),
        seo: z
          .object({
            title: z.string().optional(),
            description: z.string().optional(),
            keywords: z.array(z.string()).optional(),
          })
          .optional(),
        industryFocus: z.array(z.string()).optional(),
        displayOrder: z.number().default(0),
      })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isSubcategory && !data.parent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parent"],
        message: "Parent category is required for subcategories",
      });
    }
    if (!data.isSubcategory && data.parent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["parent"],
        message: "Parent category should not be set for top-level categories",
      });
    }
  });

module.exports = { categorySchema };
