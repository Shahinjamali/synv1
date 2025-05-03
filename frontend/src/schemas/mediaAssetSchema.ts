import { z } from 'zod';

export const mediaAssetSchema = z.object({
  type: z.enum([
    'image',
    'thumbnail',
    'cardDefault',
    'cardWide',
    'cardFeature',
    'cardSquare',
    'bannerDefault',
    'bannerTall',
    'heroCompact',
    'bannerWide',
    'bannerMini',
    'document',
    'video',
    'icon',
    'tallFeature',
  ]),
  url: z.string().url('A valid URL is required'),
  altText: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  format: z.string().optional(),
  size: z.number().optional(),
  language: z.string().default('en'),
  isPrimary: z.boolean().default(false),
  access: z
    .enum(['public', 'authenticated', 'subscriber', 'restricted'])
    .default('public'),
  restrictedRoles: z.array(z.string()).optional(),
  metadata: z
    .object({
      documentType: z
        .enum([
          'TDS',
          'SDS',
          'PDS',
          'Certification',
          'Approval',
          'Brochure',
          'CaseStudy',
          'Guide',
          'Other',
        ])
        .optional(),
      version: z.string().optional(),
      publicationDate: z.string().optional(),
      dimensions: z
        .object({
          width: z.number().optional(),
          height: z.number().optional(),
        })
        .optional(),
      duration: z.number().optional(),
    })
    .optional(),
  owner: z.object({
    type: z.enum(['product', 'category', 'service', 'orphaned']),
    id: z.string(),
  }),
  tags: z.array(z.string()).optional(),
});
