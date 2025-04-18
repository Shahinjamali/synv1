type FieldType =
  | 'text'
  | 'textarea'
  | 'dropdown'
  | 'checkbox'
  | 'array'
  | 'number';

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  subFields?: FieldConfig[];
}

export const inputConfig: Record<
  string,
  { sections: Record<string, FieldConfig[]> }
> = {
  product: {
    sections: {
      basicInfo: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'tagline', label: 'Tagline', type: 'text' },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'overview', label: 'Overview', type: 'textarea' },
        {
          name: 'description.short',
          label: 'Short Description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'description.detailed',
          label: 'Detailed Description',
          type: 'textarea',
        },
      ],
      categorization: [],
      details: [
        {
          name: 'keyFeatures',
          label: 'Key Features',
          type: 'array',
          subFields: [{ name: 'feature', label: 'Feature', type: 'text' }],
        },
        {
          name: 'applications',
          label: 'Applications',
          type: 'array',
          subFields: [
            { name: 'industry', label: 'Industry', type: 'text' },
            { name: 'useCase', label: 'Use Case', type: 'text' },
            {
              name: 'materials',
              label: 'Materials',
              type: 'array',
              subFields: [
                { name: 'material', label: 'Material', type: 'text' },
              ],
            },
            { name: 'notes', label: 'Notes', type: 'text' },
          ],
        },
        {
          name: 'specifications',
          label: 'Specifications',
          type: 'array',
          subFields: [
            { name: 'key', label: 'Key', type: 'text' },
            { name: 'value', label: 'Value', type: 'text' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'testMethod', label: 'Test Method', type: 'text' },
            { name: 'dataType', label: 'Data Type', type: 'text' },
            { name: 'isVisible', label: 'Visible', type: 'checkbox' },
            { name: 'group', label: 'Group', type: 'text' },
          ],
        },
        {
          name: 'approvals',
          label: 'Approvals',
          type: 'array',
          subFields: [
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'authority', label: 'Authority', type: 'text' },
            { name: 'certificateId', label: 'Certificate ID', type: 'text' },
            { name: 'url', label: 'URL', type: 'text' },
            { name: 'region', label: 'Region', type: 'text' },
            { name: 'status', label: 'Status', type: 'text' },
            { name: 'access', label: 'Access', type: 'text' },
            { name: 'expiryDate', label: 'Expiry Date', type: 'text' },
            { name: 'documentId', label: 'Document ID', type: 'text' },
          ],
        },
        {
          name: 'packaging',
          label: 'Packaging',
          type: 'array',
          subFields: [
            { name: 'type', label: 'Type', type: 'text' },
            { name: 'size', label: 'Size', type: 'number' },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'sku', label: 'SKU', type: 'text' },
            { name: 'partNumber', label: 'Part Number', type: 'text' },
            {
              name: 'availability',
              label: 'Availability',
              type: 'dropdown',
              options: [
                { value: 'in_stock', label: 'In Stock' },
                { value: 'out_of_stock', label: 'Out of Stock' },
                { value: 'on_request', label: 'On Request' },
              ],
            },
          ],
        },
        {
          name: 'compatibility',
          label: 'Compatibility',
          type: 'array',
          subFields: [
            {
              name: 'type',
              label: 'Type',
              type: 'dropdown',
              options: [
                { value: 'material', label: 'Material' },
                { value: 'seal', label: 'Seal' },
                { value: 'coolant', label: 'Coolant' },
                { value: 'paint', label: 'Paint' },
              ],
            },
            { name: 'name', label: 'Name', type: 'text' },
            {
              name: 'rating',
              label: 'Rating',
              type: 'dropdown',
              options: [
                { value: 'excellent', label: 'Excellent' },
                { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' },
                { value: 'poor', label: 'Poor' },
                { value: 'not_recommended', label: 'Not Recommended' },
                { value: 'test_required', label: 'Test Required' },
              ],
            },
            { name: 'notes', label: 'Notes', type: 'text' },
          ],
        },
      ],
      properties: [
        { name: 'properties.baseOil', label: 'Base Oil', type: 'text' },
        {
          name: 'properties.viscosityGrade',
          label: 'Viscosity Grade',
          type: 'text',
        },
        {
          name: 'properties.viscosityIndex',
          label: 'Viscosity Index',
          type: 'number',
        },
        { name: 'properties.foodGrade', label: 'Food Grade', type: 'checkbox' },
        {
          name: 'properties.biodegradable',
          label: 'Biodegradable',
          type: 'checkbox',
        },
        { name: 'properties.color', label: 'Color', type: 'text' },
      ],
      compliance: [
        {
          name: 'compliance.reachCompliant',
          label: 'REACH Compliant',
          type: 'checkbox',
        },
        {
          name: 'compliance.rohsCompliant',
          label: 'RoHS Compliant',
          type: 'checkbox',
        },
        {
          name: 'compliance.halalCertified',
          label: 'Halal Certified',
          type: 'checkbox',
        },
        {
          name: 'compliance.kosherCertified',
          label: 'Kosher Certified',
          type: 'checkbox',
        },
      ],
      relations: [
        {
          name: 'relatedProducts',
          label: 'Related Products',
          type: 'array',
          subFields: [
            { name: 'productId', label: 'Product ID', type: 'text' },
            {
              name: 'relationshipType',
              label: 'Relationship Type',
              type: 'text',
            },
          ],
        },
      ],
      visibility: [
        {
          name: 'visibility.isPublic',
          label: 'Publicly Visible',
          type: 'checkbox',
        },
        {
          name: 'visibility.requiresAuth',
          label: 'Requires Auth',
          type: 'checkbox',
        },
        {
          name: 'visibility.requiresSubscription',
          label: 'Requires Subscription',
          type: 'checkbox',
        },
      ],
      media: [],
      metadata: [
        {
          name: 'metadata.status',
          label: 'Status',
          type: 'dropdown',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
            { value: 'archived', label: 'Archived' },
            { value: 'discontinued', label: 'Discontinued' },
          ],
        },
        {
          name: 'metadata.tags',
          label: 'Tags',
          type: 'array',
          subFields: [{ name: 'tag', label: 'Tag', type: 'text' }],
        },
      ],
    },
  },
  service: {
    sections: {
      basicInfo: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'tagline', label: 'Tagline', type: 'text' },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        { name: 'overview', label: 'Overview', type: 'textarea' },
        {
          name: 'description.short',
          label: 'Short Description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'description.detailed',
          label: 'Detailed Description',
          type: 'textarea',
        },
        { name: 'targetAudience', label: 'Target Audience', type: 'text' },
      ],
      categorization: [],
      details: [
        {
          name: 'keyBenefits',
          label: 'Key Benefits',
          type: 'array',
          subFields: [{ name: 'benefit', label: 'Benefit', type: 'text' }],
        },
        {
          name: 'deliverables',
          label: 'Deliverables',
          type: 'array',
          subFields: [
            { name: 'item', label: 'Item', type: 'text' },
            { name: 'format', label: 'Format', type: 'text' },
            { name: 'frequency', label: 'Frequency', type: 'text' },
          ],
        },
        {
          name: 'serviceLevels',
          label: 'Service Levels',
          type: 'array',
          subFields: [
            { name: 'name', label: 'Name', type: 'text' },
            { name: 'description', label: 'Description', type: 'text' },
            {
              name: 'featuresIncluded',
              label: 'Features Included',
              type: 'array',
              subFields: [{ name: 'feature', label: 'Feature', type: 'text' }],
            },
          ],
        },
        {
          name: 'parametersMonitored',
          label: 'Parameters Monitored',
          type: 'array',
          subFields: [
            { name: 'parameter', label: 'Parameter', type: 'text' },
            { name: 'technology', label: 'Technology', type: 'text' },
            { name: 'unit', label: 'Unit', type: 'text' },
          ],
        },
        {
          name: 'technologyUsed',
          label: 'Technology Used',
          type: 'array',
          subFields: [
            { name: 'technology', label: 'Technology', type: 'text' },
          ],
        },
        { name: 'duration', label: 'Duration', type: 'text' },
        {
          name: 'reportingDetails.dashboardAccess',
          label: 'Dashboard Access',
          type: 'checkbox',
        },
        {
          name: 'reportingDetails.standardReports',
          label: 'Standard Reports',
          type: 'array',
          subFields: [{ name: 'report', label: 'Report', type: 'text' }],
        },
        {
          name: 'reportingDetails.customReportingAvailable',
          label: 'Custom Reporting Available',
          type: 'checkbox',
        },
        {
          name: 'applicableIndustries',
          label: 'Applicable Industries',
          type: 'array',
          subFields: [{ name: 'industry', label: 'Industry', type: 'text' }],
        },
        {
          name: 'applicableEquipment',
          label: 'Applicable Equipment',
          type: 'array',
          subFields: [{ name: 'equipment', label: 'Equipment', type: 'text' }],
        },
        {
          name: 'prerequisites',
          label: 'Prerequisites',
          type: 'array',
          subFields: [
            { name: 'requirement', label: 'Requirement', type: 'text' },
          ],
        },
      ],
      media: [],
      metadata: [
        {
          name: 'metadata.status',
          label: 'Status',
          type: 'dropdown',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
            { value: 'archived', label: 'Archived' },
          ],
        },
        {
          name: 'metadata.tags',
          label: 'Tags',
          type: 'array',
          subFields: [{ name: 'tag', label: 'Tag', type: 'text' }],
        },
        {
          name: 'metadata.relatedProducts',
          label: 'Related Products',
          type: 'array',
          subFields: [{ name: 'productId', label: 'Product ID', type: 'text' }],
        },
        {
          name: 'metadata.relatedCaseStudies',
          label: 'Related Case Studies',
          type: 'array',
          subFields: [
            { name: 'caseStudyId', label: 'Case Study ID', type: 'text' },
          ],
        },
      ],
    },
  },

  category: {
    sections: {
      basicInfo: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'slug', label: 'Slug', type: 'text', required: true },
        {
          name: 'scope',
          label: 'Scope',
          type: 'dropdown',
          options: [
            { value: 'product', label: 'Product' },
            { value: 'service', label: 'Service' },
          ],
          required: true,
        },
        { name: 'overview', label: 'Overview', type: 'textarea' },
        {
          name: 'description.short',
          label: 'Short Description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'description.detailed',
          label: 'Detailed Description',
          type: 'textarea',
        },
        { name: 'isSubcategory', label: 'Is Subcategory', type: 'checkbox' },
        { name: 'parent', label: 'Parent Category', type: 'text' },
      ],
      categorization: [],
      details: [],
      media: [],
      metadata: [
        {
          name: 'metadata.status',
          label: 'Status',
          type: 'dropdown',
          options: [
            { value: 'active', label: 'Active' },
            { value: 'draft', label: 'Draft' },
            { value: 'archived', label: 'Archived' },
          ],
        },
        {
          name: 'metadata.industryFocus',
          label: 'Industry Focus',
          type: 'array',
          subFields: [{ name: 'focus', label: 'Focus Area', type: 'text' }],
        },
        {
          name: 'metadata.displayOrder',
          label: 'Display Order',
          type: 'number',
        },
      ],
    },
  },
};
