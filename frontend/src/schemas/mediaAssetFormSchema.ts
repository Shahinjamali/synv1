import { z } from 'zod';

const metadataForm = z
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
      .object({ width: z.number().optional(), height: z.number().optional() })
      .optional(),
    duration: z.number().optional(),
  })
  .default({});

export const mediaAssetFormSchema = z.object({
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
    'tallFeature',
  ]),
  title: z.string().min(1, 'Title is required'),
  altText: z.string().optional(),
  description: z.string().optional(),
  language: z.string().optional(),
  isPrimary: z.boolean().optional(),
  access: z
    .enum(['public', 'authenticated', 'subscriber', 'restricted'])
    .optional(),
  restrictedRoles: z.array(z.string()).optional(),
  metadata: metadataForm,
  tags: z.array(z.string()).optional(),
  file: z.instanceof(File).optional(),
});
