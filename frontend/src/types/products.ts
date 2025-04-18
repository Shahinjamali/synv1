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

export interface Application {
  industry: string;
  useCase: string;
  materials?: string[];
  notes?: string;
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
  _id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  slug: string;
  overview?: string;
  description: {
    short: string;
    detailed?: string;
  };
  category: string;
  subcategory: string;
  categorySlug: string;
  subcategorySlug: string;
  keyFeatures?: string[];
  specifications?: Specification[];
  approvals?: Approval[];
  applications?: Application[];
  packaging?: Packaging[];
  compatibility?: Compatibility[];
  properties?: {
    baseOil?:
      | 'mineral'
      | 'synthetic_pao'
      | 'synthetic_ester'
      | 'synthetic_pag'
      | 'semi-synthetic'
      | 'bio-based'
      | 'silicone';
    viscosityGrade?: string;
    viscosityIndex?: number;
    flashPoint?: {
      value: number;
      unit: string;
      testMethod?: string;
    };
    pourPoint?: {
      value: number;
      unit: string;
      testMethod?: string;
    };
    density?: {
      value: number;
      unit: string;
      temp?: number;
      testMethod?: string;
    };
    foodGrade?: boolean;
    nsfRegistration?: {
      number?: string;
      categoryCode?: string;
    };
    biodegradable?: boolean;
    operatingTempRange?: {
      min?: number;
      max?: number;
      unit?: string;
    };
    color?: string;
  };
  compliance?: Compliance;
  relatedProducts?: RelatedProduct[];
  mediaAssets?: string[];
  visibility?: Visibility;
  metadata?: Metadata;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  totalPages: number;
}
