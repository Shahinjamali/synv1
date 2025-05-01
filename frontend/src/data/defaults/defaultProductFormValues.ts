// src/data/defaults/defaultProductFormValues.ts
import { z } from 'zod';
import { productSchema } from '@/schemas/productSchema';

export const defaultProductFormValues: z.infer<typeof productSchema> = {
  title: '',
  subtitle: '',
  tagline: '',
  slug: '',
  category: '',
  subcategory: '',
  categorySlug: '',
  subcategorySlug: '',
  overview: '',
  description: { short: '', detailed: '' },
  keyFeatures: [],
  applications: [],
  specifications: [],
  approvals: [],
  packaging: [],
  compatibility: [],
  compliance: {
    halalCertified: false,
    kosherCertified: false,
    reachCompliant: undefined,
    reachStatus: undefined,
    rohsCompliant: undefined,
    vocContent: undefined,
    ghs: undefined,
  },
  relatedProducts: [],
  mediaAssets: [],
  visibility: {
    isPublic: true,
    requiresAuth: false,
    requiresSubscription: false,
    restrictedRoles: [],
  },
  metadata: {
    status: 'active',
    version: '1.0.0',
    internalCode: undefined,
    replacesProduct: undefined,
    replacedByProduct: undefined,
    seo: undefined,
    tags: [],
  },
};
