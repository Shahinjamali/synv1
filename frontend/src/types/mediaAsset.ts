export interface MediaAsset {
  _id?: string;
  type: 'image' | 'thumbnail' | 'icon' | 'document' | 'video';
  url: string;
  altText?: string;
  title: string;
  description?: string;
  format?: string;
  size?: number;
  language: string;
  isPrimary: boolean;
  access: 'public' | 'authenticated' | 'subscriber' | 'restricted';
  restrictedRoles?: string[];
  metadata?: {
    documentType?:
      | 'TDS'
      | 'SDS'
      | 'PDS'
      | 'Certification'
      | 'Approval'
      | 'Brochure'
      | 'CaseStudy'
      | 'Guide'
      | 'Other';
    version?: string;
    publicationDate?: string;
    dimensions?: {
      width?: number;
      height?: number;
    };
    duration?: number;
  };
  owner: {
    type: 'product' | 'category' | 'service';
    id: string;
  };
}
