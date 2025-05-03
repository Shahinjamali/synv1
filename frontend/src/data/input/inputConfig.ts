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
      media: [],
      details: [
        {
          name: 'keyFeatures',
          label: 'Key Features',
          type: 'array',
          subFields: [{ name: '', label: 'Feature', type: 'text' }],
        },
        {
          name: 'applications',
          label: 'Applications',
          type: 'array',
          subFields: [{ name: '', label: 'Application', type: 'text' }],
        },
        {
          name: 'specifications',
          label: 'Specifications',
          type: 'array',
          subFields: [
            { name: 'key', label: 'Key', type: 'text', required: true }, // Changed from name to key
            { name: 'value', label: 'Value', type: 'text', required: true },
            { name: 'unit', label: 'Unit', type: 'text' },
            { name: 'testMethod', label: 'Test Method', type: 'text' },
            { name: 'standard', label: 'Standard', type: 'text' },
          ],
        },
        {
          name: 'approvals',
          label: 'Approvals',
          type: 'array',
          subFields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'issuer', label: 'Issuer', type: 'text', required: true },
            {
              name: 'status',
              label: 'Status',
              type: 'dropdown',
              required: true,
              options: [
                { value: 'active', label: 'Active' },
                { value: 'pending', label: 'Pending' },
                { value: 'expired', label: 'Expired' },
              ],
            },
            {
              name: 'certificateNumber',
              label: 'Certificate Number',
              type: 'text',
            },
            { name: 'validUntil', label: 'Valid Until', type: 'text' },
          ],
        },
        {
          name: 'packaging',
          label: 'Packaging',
          type: 'array',
          subFields: [
            { name: 'type', label: 'Type', type: 'text', required: true },
            { name: 'size', label: 'Size', type: 'number', required: true },
            { name: 'unit', label: 'Unit', type: 'text', required: true },
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
              required: true,
              options: [
                { value: 'material', label: 'Material' },
                { value: 'seal', label: 'Seal' },
                { value: 'coolant', label: 'Coolant' },
                { value: 'paint', label: 'Paint' },
              ],
            },
            { name: 'name', label: 'Name', type: 'text', required: true },
            {
              name: 'rating',
              label: 'Rating',
              type: 'dropdown',
              required: true,
              options: [
                { value: 'excellent', label: 'Excellent' },
                { value: 'good', label: 'Good' },
                { value: 'fair', label: 'Fair' },
                { value: 'poor', label: 'Poor' },
                { value: 'not_recommended', label: 'Not Recommended' },
                { value: 'test_required', label: 'Test Required' },
              ],
            },
            { name: 'notes', label: 'Notes', type: 'textarea' },
          ],
        },
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
            {
              name: 'productId',
              label: 'Product ID',
              type: 'text',
              required: true,
            },
            {
              name: 'relationshipType',
              label: 'Relationship Type',
              type: 'dropdown',
              required: true,
              options: [
                { value: 'alternative', label: 'Alternative' },
                { value: 'complementary', label: 'Complementary' },
                { value: 'upgrade', label: 'Upgrade' },
                { value: 'downgrade', label: 'Downgrade' },
                { value: 'required_accessory', label: 'Required Accessory' },
                { value: 'previous_version', label: 'Previous Version' },
                { value: 'next_version', label: 'Next Version' },
              ],
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
          subFields: [{ name: '', label: 'Tag', type: 'text' }], // Empty name for string array
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
      ],
      categorization: [], // Handled by CategorySelector
      media: [], // Handled by MediaUploader and MediaForm
      details: [
        {
          name: 'keyBenefits',
          label: 'Key Benefits',
          type: 'array',
          subFields: [
            { name: '', label: 'Benefit', type: 'text' }, // Empty name for string array
          ],
        },
        {
          name: 'targetAudience',
          label: 'Target Audience',
          type: 'textarea',
        },
        {
          name: 'methodology',
          label: 'Methodology',
          type: 'textarea',
        },
        {
          name: 'deliverables',
          label: 'Deliverables',
          type: 'array',
          subFields: [
            { name: 'item', label: 'Item', type: 'text', required: true },
            { name: 'format', label: 'Format', type: 'text' },
            { name: 'frequency', label: 'Frequency', type: 'text' },
          ],
        },
        {
          name: 'serviceLevels',
          label: 'Service Levels',
          type: 'array',
          subFields: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'description', label: 'Description', type: 'textarea' },
            {
              name: 'featuresIncluded',
              label: 'Features Included',
              type: 'array',
              subFields: [
                { name: '', label: 'Feature', type: 'text' }, // Empty name for string array
              ],
            },
          ],
        },
        {
          name: 'parametersMonitored',
          label: 'Parameters Monitored',
          type: 'array',
          subFields: [
            {
              name: 'parameter',
              label: 'Parameter',
              type: 'text',
              required: true,
            },
            { name: 'technology', label: 'Technology', type: 'text' },
            { name: 'unit', label: 'Unit', type: 'text' },
          ],
        },
        {
          name: 'technologyUsed',
          label: 'Technology Used',
          type: 'array',
          subFields: [
            { name: '', label: 'Technology', type: 'text' }, // Empty name for string array
          ],
        },
        {
          name: 'duration',
          label: 'Duration',
          type: 'text',
        },
        {
          name: 'reportingDetails.dashboardAccess',
          label: 'Dashboard Access',
          type: 'checkbox',
        },
        {
          name: 'reportingDetails.standardReports',
          label: 'Standard Reports',
          type: 'array',
          subFields: [
            { name: '', label: 'Report', type: 'text' }, // Empty name for string array
          ],
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
          subFields: [
            { name: '', label: 'Industry', type: 'text' }, // Empty name for string array
          ],
        },
        {
          name: 'applicableEquipment',
          label: 'Applicable Equipment',
          type: 'array',
          subFields: [
            { name: '', label: 'Equipment', type: 'text' }, // Empty name for string array
          ],
        },
        {
          name: 'prerequisites',
          label: 'Prerequisites',
          type: 'array',
          subFields: [
            { name: '', label: 'Prerequisite', type: 'text' }, // Empty name for string array
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
          label: 'Requires Authentication',
          type: 'checkbox',
        },
        {
          name: 'visibility.restrictedRoles',
          label: 'Restricted Roles',
          type: 'array',
          subFields: [
            { name: '', label: 'Role', type: 'text' }, // Empty name for string array
          ],
        },
      ],
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
          name: 'metadata.version',
          label: 'Version',
          type: 'text',
        },
        {
          name: 'metadata.internalCode',
          label: 'Internal Code',
          type: 'text',
        },
        {
          name: 'metadata.tags',
          label: 'Tags',
          type: 'array',
          subFields: [{ name: '', label: 'Tag', type: 'text' }],
        },
        {
          name: 'metadata.relatedCaseStudies',
          label: 'Related Case Studies (ObjectIds)',
          type: 'array',
          subFields: [
            { name: '', label: 'Case Study ID', type: 'text' }, // Expecting ObjectId
          ],
        },
        {
          name: 'metadata.relatedProducts',
          label: 'Related Products (ObjectIds)',
          type: 'array',
          subFields: [
            { name: '', label: 'Product ID', type: 'text' }, // Expecting ObjectId
          ],
        },
        {
          name: 'metadata.seo.title',
          label: 'SEO Title',
          type: 'text',
        },
        {
          name: 'metadata.seo.description',
          label: 'SEO Description',
          type: 'textarea',
        },
        {
          name: 'metadata.seo.keywords',
          label: 'SEO Keywords',
          type: 'array',
          subFields: [{ name: '', label: 'Keyword', type: 'text' }],
        },
      ],
    },
  },

  category: {
    sections: {
      basicInfo: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'tagline', label: 'Tagline', type: 'text' },
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
      ],
      categorization: [], // Handled by CategorySelector
      media: [], // Handled by MediaUploader and MediaForm
      details: [
        {
          name: 'keyFeatures',
          label: 'Key Features',
          type: 'array',
          subFields: [{ name: '', label: 'Feature', type: 'text' }],
        },
        {
          name: 'applications',
          label: 'Applications',
          type: 'array',
          subFields: [{ name: '', label: 'Application', type: 'text' }],
        },
      ],
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
          subFields: [
            { name: '', label: 'Industry', type: 'text' }, // Empty name to submit as string
          ],
        },
        {
          name: 'metadata.seo.title',
          label: 'SEO Title',
          type: 'text',
        },
        {
          name: 'metadata.seo.description',
          label: 'SEO Description',
          type: 'textarea',
        },
        {
          name: 'metadata.seo.keywords',
          label: 'SEO Keywords',
          type: 'array',
          subFields: [
            { name: '', label: 'Keyword', type: 'text' }, // Empty name for string array
          ],
        },
        {
          name: 'metadata.displayOrder',
          label: 'Display Order',
          type: 'number',
          required: true,
        },
      ],
    },
  },
};
