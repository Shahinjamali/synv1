import { z } from 'zod';

export const serviceSchema = z.object({
  // Basic Info
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),

  // Categorization
  category: z.string().min(1, 'Category is required'),
  categorySlug: z.string().optional(),

  // Description & Features
  overview: z.string().optional(),
  description: z.object({
    short: z.string().min(1, 'Short description is required'),
    detailed: z.string().optional(),
  }),
  keyBenefits: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),

  // Service Details
  methodology: z.string().optional(),
  deliverables: z
    .array(
      z.object({
        item: z.string().min(1),
        format: z.string().optional(),
        frequency: z.string().optional(),
      })
    )
    .optional(),
  serviceLevels: z
    .array(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        featuresIncluded: z.array(z.string()).optional(),
      })
    )
    .optional(),
  parametersMonitored: z
    .array(
      z.object({
        parameter: z.string().min(1),
        technology: z.string().optional(),
        unit: z.string().optional(),
      })
    )
    .optional(),
  technologyUsed: z.array(z.string()).optional(),
  duration: z.string().optional(),
  reportingDetails: z
    .object({
      dashboardAccess: z.boolean().optional(),
      standardReports: z.array(z.string()).optional(),
      customReportingAvailable: z.boolean().optional(),
    })
    .optional(),

  // Applicability
  applicableIndustries: z.array(z.string()).optional(),
  applicableEquipment: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),

  // Media Assets
  mediaAssets: z.array(z.string()).optional(),

  // Visibility
  visibility: z
    .object({
      isPublic: z.boolean().optional(),
      requiresAuth: z.boolean().optional(),
      restrictedRoles: z.array(z.string()).optional(),
    })
    .optional(),

  // Metadata
  metadata: z.object({
    status: z.enum(['active', 'draft', 'archived']).default('active'),
    version: z.string().optional(),
    internalCode: z.string().optional(),
    tags: z.array(z.string()).optional(),
    relatedCaseStudies: z.array(z.string()).optional(),
    relatedProducts: z.array(z.string()).optional(),
  }),
});
