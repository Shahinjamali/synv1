import { MediaAsset } from './mediaAsset';

export interface Category {
  id?: string;
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  scope: 'product' | 'service';
  isSubcategory: boolean;
  parent: string | null;
  parentSlug: string | null;
  overview?: string;
  description: {
    short: string;
    detailed?: string;
  };
  mediaAssets?: MediaAsset[];
  metadata: {
    status: 'active' | 'draft' | 'archived';
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    industryFocus?: string[];
    displayOrder?: number;
  };
}

export interface CategoryListResponse {
  items: Category[];
  total: number;
  page: number;
  totalPages: number;
}
