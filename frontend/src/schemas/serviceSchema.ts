// schemas/serviceSchema.ts (partial update)
import { z } from 'zod';

const isValidObjectId = (val: string) => /^[0-9a-fA-F]{24}$/.test(val);

export const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),
  category: z.string().min(1, 'Category is required'),
  categorySlug: z.string().optional(),
  overview: z.string().optional(),
  description: z
    .object({
      short: z.string().min(1, 'Short description is required'),
      detailed: z.string().optional(),
    })
    .optional(),
  keyBenefits: z.array(z.string()).optional(),
  targetAudience: z.string().optional(),
  methodology: z.string().optional(),
  deliverables: z
    .array(
      z.object({
        item: z.string().min(1, 'Deliverable item is required'),
        format: z.string().optional(),
        frequency: z.string().optional(),
      })
    )
    .optional(),
  serviceLevels: z
    .array(
      z.object({
        name: z.string().min(1, 'Service level name is required'),
        description: z.string().optional(),
        featuresIncluded: z.array(z.string()).optional(),
      })
    )
    .optional(),
  parametersMonitored: z
    .array(
      z.object({
        parameter: z.string().min(1, 'Parameter is required'),
        technology: z.string().optional(),
        unit: z.string().optional(),
      })
    )
    .optional(),
  technologyUsed: z.array(z.string()).optional(),
  duration: z.string().optional(),
  reportingDetails: z
    .object({
      dashboardAccess: z.boolean().default(false),
      standardReports: z.array(z.string()).optional(),
      customReportingAvailable: z.boolean().default(false),
    })
    .optional(),
  applicableIndustries: z.array(z.string()).optional(),
  applicableEquipment: z.array(z.string()).optional(),
  prerequisites: z.array(z.string()).optional(),
  mediaAssets: z.array(z.string()).optional(),
  visibility: z
    .object({
      isPublic: z.boolean().default(true),
      requiresAuth: z.boolean().default(false),
      restrictedRoles: z.array(z.string()).optional(),
    })
    .optional(),
  metadata: z
    .object({
      status: z.enum(['active', 'draft', 'archived']).default('active'),
      version: z.string().default('1.0.0'),
      internalCode: z.string().optional(),
      tags: z.array(z.string()).optional(),
      relatedCaseStudies: z
        .array(
          z.string().refine((val) => isValidObjectId(val), {
            message:
              'Related case study must be a valid 24-character hex string',
          })
        )
        .optional(),
      relatedProducts: z
        .array(
          z.string().refine((val) => isValidObjectId(val), {
            message: 'Related product must be a valid 24-character hex string',
          })
        )
        .optional(),
    })
    .optional(),
});
