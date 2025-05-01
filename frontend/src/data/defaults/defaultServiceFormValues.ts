// src/data/defaults/defaultServiceFormValues.ts
import { Service } from '@/types/services';

export const defaultServiceFormValues: Partial<Service> = {
  title: '',
  subtitle: '',
  tagline: '',
  slug: '',
  category: '',
  categorySlug: '',
  overview: '',
  description: {
    short: '',
    detailed: '',
  },
  keyBenefits: [],
  targetAudience: '',
  methodology: '',
  deliverables: [],
  serviceLevels: [],
  parametersMonitored: [],
  technologyUsed: [],
  duration: '',
  reportingDetails: {
    dashboardAccess: false,
    standardReports: [],
    customReportingAvailable: false,
  },
  applicableIndustries: [],
  applicableEquipment: [],
  prerequisites: [],
  mediaAssets: [],
  visibility: {
    isPublic: true,
    requiresAuth: false,
    restrictedRoles: [],
  },
  metadata: {
    status: 'active',
    version: '1.0.0',
    internalCode: '',
    tags: [],
    relatedCaseStudies: [],
    relatedProducts: [],
  },
};
