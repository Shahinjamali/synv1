import { MediaAsset } from './mediaAsset';

export interface Specification {
  key: string;
  value: string;
  unit?: string;
  testMethod?: string;
  dataType?: 'number' | 'string' | 'boolean' | 'range';
  isVisible?: boolean;
  group?: string;
}

export interface Approval {
  name: string;
  authority?: string;
  certificateId?: string;
  url?: string;
  region?: string;
  expiryDate?: string;
  status?: 'active' | 'pending' | 'expired';
  documentId?: string;
  access?: 'public' | 'authenticated' | 'subscriber';
}

export interface Packaging {
  type: string;
  size: number;
  unit: string;
  sku?: string;
  partNumber?: string;
  availability?: 'in_stock' | 'out_of_stock' | 'on_request';
}

export interface Compatibility {
  type: 'material' | 'seal' | 'coolant' | 'paint';
  name: string;
  rating?:
    | 'excellent'
    | 'good'
    | 'fair'
    | 'poor'
    | 'not_recommended'
    | 'test_required';
  notes?: string;
}

export interface Compliance {
  sds?: {
    available?: boolean;
    documentId?: string;
    version?: string;
    lastChecked?: string;
    access?: 'public' | 'authenticated' | 'subscriber' | 'restricted';
  };
  reachCompliant?: boolean;
  reachStatus?: string;
  rohsCompliant?: boolean;
  vocContent?: {
    value: number;
    unit: string;
    testMethod: string;
  };
  ghs?: {
    classification?: string;
    signalWord?: string;
    pictograms?: string[];
  };
  halalCertified?: boolean;
  kosherCertified?: boolean;
}

export interface RelatedProduct {
  productId: string;
  relationshipType:
    | 'alternative'
    | 'complementary'
    | 'upgrade'
    | 'downgrade'
    | 'required_accessory'
    | 'previous_version'
    | 'next_version';
}

export interface Visibility {
  isPublic: boolean;
  requiresAuth: boolean;
  requiresSubscription: boolean;
  restrictedRoles?: string[];
}

export interface Metadata {
  status: 'active' | 'draft' | 'archived' | 'discontinued';
  version?: string;
  internalCode?: string;
  replacesProduct?: string;
  replacedByProduct?: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  tags?: string[];
}

export interface Product {
  id?: string;
  _id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  slug: string;
  category: string;
  subcategory: string;
  categorySlug?: string;
  subcategorySlug?: string;
  overview?: string;
  mediaAssets: MediaAsset[];
  description?: {
    short: string;
    detailed?: string;
  };
  keyFeatures?: string[];
  applications?: string[];
  specifications?: Array<{
    key: string;
    value: string | number;
    unit?: string;
    testMethod?: string;
    standard?: string;
  }>;
  approvals?: Array<{
    name: string;
    issuer: string;
    status: 'active' | 'pending' | 'expired';
    certificateNumber?: string;
    validUntil?: string;
    documentId?: string;
  }>;
  packaging?: Array<{
    type: string;
    size: number;
    unit: string;
    sku?: string;
    partNumber?: string;
    availability?: 'in_stock' | 'out_of_stock' | 'on_request';
  }>;
  compatibility?: Array<{
    type: 'material' | 'seal' | 'coolant' | 'paint';
    name: string;
    rating:
      | 'excellent'
      | 'good'
      | 'fair'
      | 'poor'
      | 'not_recommended'
      | 'test_required';
    notes?: string;
  }>;
  compliance?: {
    reachCompliant?: boolean;
    reachStatus?: string;
    rohsCompliant?: boolean;
    vocContent?: {
      value?: number;
      unit?: string;
      testMethod?: string;
    };
    ghs?: {
      classification?: string;
      signalWord?: string;
      pictograms?: string[];
    };
    halalCertified: boolean; // Match schema's default
    kosherCertified: boolean; // Match schema's default
  };
  relatedProducts?: Array<{
    productId: string;
    relationshipType:
      | 'alternative'
      | 'complementary'
      | 'upgrade'
      | 'downgrade'
      | 'required_accessory'
      | 'previous_version'
      | 'next_version';
  }>;
  // mediaAssets?: string[]; // Match schema
  visibility?: {
    isPublic: boolean;
    requiresAuth: boolean;
    requiresSubscription: boolean;
    restrictedRoles?: string[];
  };
  metadata?: {
    status: 'active' | 'draft' | 'archived' | 'discontinued';
    version: string;
    internalCode?: string;
    replacesProduct?: string;
    replacedByProduct?: string;
    seo?: {
      title?: string;
      description?: string;
      keywords?: string[];
    };
    tags?: string[];
  };
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}
