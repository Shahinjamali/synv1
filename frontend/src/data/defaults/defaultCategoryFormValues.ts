// src/data/defaults/defaultCategoryFormValues.ts
import { Category } from '@/types/category';

export const defaultCategoryFormValues: Partial<Category> = {
  title: '',
  subtitle: '',
  slug: '',
  scope: 'product',
  isSubcategory: false,
  parent: '',
  parentSlug: '',
  overview: '',
  description: {
    short: '',
    detailed: '',
  },
  mediaAssets: [],
  metadata: {
    status: 'active',
    seo: {
      title: '',
      description: '',
      keywords: [],
    },
    industryFocus: [],
    displayOrder: 0,
  },
};
