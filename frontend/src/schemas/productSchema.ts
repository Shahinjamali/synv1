import { z } from 'zod';

export const productSchema = z.object({
  // Basic Info
  title: z.string().min(1, 'Title is required'),
  subtitle: z.string().optional(),
  tagline: z.string().optional(),
  slug: z.string().min(1, 'Slug is required'),

  // Categorization
  category: z.string().min(1, 'Category is required'),
  subcategory: z.string().min(1, 'Subcategory is required'),
  categorySlug: z.string().optional(),
  subcategorySlug: z.string().optional(),

  // Description
  overview: z.string().optional(),
  description: z.object({
    short: z.string().min(1, 'Short description is required'),
    detailed: z.string().optional(),
  }),

  // Features and Applications
  keyFeatures: z.array(z.string()).optional(),
  applications: z
    .array(
      z.object({
        industry: z.string().min(1),
        useCase: z.string().min(1),
        materials: z.array(z.string()),
        notes: z.string().optional(),
      })
    )
    .optional(),

  // Specifications
  specifications: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
        unit: z.string().optional(),
        testMethod: z.string().optional(),
        dataType: z.string().optional(),
        isVisible: z.boolean().optional(),
        group: z.string().optional(),
      })
    )
    .optional(),

  // Approvals
  approvals: z
    .array(
      z.object({
        name: z.string(),
        authority: z.string().optional(),
        certificateId: z.string().optional(),
        url: z.string().optional(),
        region: z.string().optional(),
        status: z.string().optional(),
        access: z.string().optional(),
        expiryDate: z.string().optional(),
        documentId: z.string().optional(),
      })
    )
    .optional(),

  // Packaging
  packaging: z
    .array(
      z.object({
        type: z.string(),
        size: z.number(),
        unit: z.string(),
        sku: z.string().optional(),
        partNumber: z.string().optional(),
        availability: z
          .enum(['in_stock', 'out_of_stock', 'on_request'])
          .optional(),
      })
    )
    .optional(),

  // Compatibility
  compatibility: z
    .array(
      z.object({
        type: z.enum(['material', 'seal', 'coolant', 'paint']),
        name: z.string(),
        rating: z.enum([
          'excellent',
          'good',
          'fair',
          'poor',
          'not_recommended',
          'test_required',
        ]),
        notes: z.string().optional(),
      })
    )
    .optional(),

  // Properties
  properties: z
    .object({
      baseOil: z
        .enum([
          'mineral',
          'synthetic_pao',
          'synthetic_ester',
          'synthetic_pag',
          'semi-synthetic',
          'bio-based',
          'silicone',
        ])
        .optional(),
      viscosityGrade: z.string().optional(),
      viscosityIndex: z.number().optional(),
      flashPoint: z
        .object({
          value: z.number(),
          unit: z.string().optional(),
          testMethod: z.string().optional(),
        })
        .optional(),
      pourPoint: z
        .object({
          value: z.number(),
          unit: z.string().optional(),
          testMethod: z.string().optional(),
        })
        .optional(),
      density: z
        .object({
          value: z.number(),
          unit: z.string().optional(),
          temp: z.number().optional(),
          testMethod: z.string().optional(),
        })
        .optional(),
      foodGrade: z.boolean().optional(),
      nsfRegistration: z
        .object({
          number: z.string().optional(),
          categoryCode: z.string().optional(),
        })
        .optional(),
      biodegradable: z.boolean().optional(),
      operatingTempRange: z
        .object({
          min: z.number().optional(),
          max: z.number().optional(),
          unit: z.string().optional(),
        })
        .optional(),
      color: z.string().optional(),
    })
    .optional(),

  // Compliance
  compliance: z
    .object({
      sds: z
        .object({
          available: z.boolean().optional(),
          documentId: z.string().optional(),
          version: z.string().optional(),
          lastChecked: z.string().optional(),
          access: z
            .enum(['public', 'authenticated', 'subscriber', 'restricted'])
            .optional(),
        })
        .optional(),
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
      halalCertified: z.boolean().optional(),
      kosherCertified: z.boolean().optional(),
    })
    .optional(),

  // Related Products
  relatedProducts: z
    .array(
      z.object({
        productId: z.string(),
        relationshipType: z.enum([
          'alternative',
          'complementary',
          'upgrade',
          'downgrade',
          'required_accessory',
          'previous_version',
          'next_version',
        ]),
      })
    )
    .optional(),

  // Media Assets
  mediaAssets: z.array(z.string()).optional(),

  // Visibility
  visibility: z
    .object({
      isPublic: z.boolean().optional(),
      requiresAuth: z.boolean().optional(),
      requiresSubscription: z.boolean().optional(),
      restrictedRoles: z.array(z.string()).optional(),
    })
    .optional(),

  // Metadata
  metadata: z.object({
    status: z
      .enum(['active', 'draft', 'archived', 'discontinued'])
      .default('active'),
    version: z.string().optional(),
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
  }),
});
