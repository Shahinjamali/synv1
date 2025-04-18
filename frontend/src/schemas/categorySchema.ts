import { z } from 'zod';

export const categorySchema = z.object({
  // Basic Info
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  scope: z.enum(['product', 'service']),
  isSubcategory: z.boolean().default(false),

  // Hierarchical Relations
  parent: z.string().nullable().optional(),
  parentSlug: z.string().nullable().optional(),

  // Descriptions
  overview: z.string().optional(),
  description: z.object({
    short: z.string().min(1, 'Short description is required'),
    detailed: z.string().optional(),
  }),

  // Media Assets
  mediaAssets: z.array(z.string()).optional(),

  // Metadata
  metadata: z.object({
    status: z.enum(['active', 'draft', 'archived']).default('active'),
    seo: z
      .object({
        title: z.string().optional(),
        description: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      })
      .optional(),
    industryFocus: z.array(z.string()).optional(),
    displayOrder: z.number().optional(),
  }),
});
