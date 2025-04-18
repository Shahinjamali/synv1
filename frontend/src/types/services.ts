export interface Deliverable {
  item: string;
  format?: string;
  frequency?: string;
}

export interface ServiceLevel {
  name: string;
  description?: string;
  featuresIncluded: string[];
}

export interface ParameterMonitored {
  parameter: string;
  technology?: string;
  unit?: string;
}

export interface ReportingDetails {
  dashboardAccess: boolean;
  standardReports?: string[];
  customReportingAvailable?: boolean;
}

export interface Visibility {
  isPublic: boolean;
  requiresAuth?: boolean;
  restrictedRoles?: string[];
}

export interface Service {
  _id: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  slug: string;
  category: string;
  categorySlug: string;
  overview?: string;
  description: {
    short: string;
    detailed?: string;
  };
  keyBenefits?: string[];
  targetAudience?: string;
  methodology?: string;
  deliverables?: Deliverable[];
  serviceLevels?: ServiceLevel[];
  parametersMonitored?: ParameterMonitored[];
  technologyUsed?: string[];
  duration?: string;
  reportingDetails?: ReportingDetails;
  applicableIndustries?: string[];
  applicableEquipment?: string[];
  prerequisites?: string[];
  mediaAssets?: string[];
  visibility?: Visibility;
  metadata: {
    status: 'active' | 'draft' | 'archived';
    version?: string;
    internalCode?: string;
    tags?: string[];
    relatedCaseStudies?: string[];
    relatedProducts?: string[];
  };
}

export interface ServiceListResponse {
  total: number;
  page: number;
  totalPages: number;
  items: Service[];
}

export interface GetServicesParams {
  categorySlug?: string;
  page?: number;
  limit?: number;
  status?: 'active' | 'draft' | 'archived';
  scope?: 'product' | 'service';
}
