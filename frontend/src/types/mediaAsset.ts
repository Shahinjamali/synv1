export interface MediaAsset {
  _id?: string;
  type:
    | 'image'
    | 'thumbnail'
    | 'icon'
    | 'document'
    | 'video'
    | 'cardDefault'
    | 'cardWide'
    | 'cardFeature'
    | 'cardSquare'
    | 'bannerDefault'
    | 'bannerTall'
    | 'heroCompact'
    | 'bannerWide'
    | 'bannerMini'
    | 'tallFeature';
  url?: string;
  altText?: string;
  title: string;
  description?: string;
  format?: string;
  size?: number;
  language?: string;
  isPrimary?: boolean;
  access?: 'public' | 'authenticated' | 'subscriber' | 'restricted';
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
  owner?: {
    type: 'product' | 'category' | 'service' | 'orphaned';
    id: string | null; // Allow null when orphaned
  };
  tags?: string[];
  status?: 'orphaned' | 'assigned';
  createdAt?: string;
  updatedAt?: string;
  file?: File; // Frontend only
}
export interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  aspect?: number;
}
