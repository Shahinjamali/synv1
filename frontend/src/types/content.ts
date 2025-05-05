// @/types/content.ts

import { MediaAsset } from './mediaAsset';
export interface TestimonialData {
  name: string;
  company: string;
  position: string;
  quote: string;
  rating: number;
  imageUrl?: string;
}

export interface Blogs {
  id: string;
  title: string;
  subtitle?: string;
  slug: string;

  overview: string; // short high-level summary
  excerpt: string; // snippet for listing view

  description?: {
    short?: string;
    detailed?: string;
  };

  content: string; // full rich content (HTML or Markdown)

  date: string; // publication date (ISO string)
  published_at?: string;
  created_at?: string;
  updated_at?: string;

  author?: string; // or object if expanded
  categories?: string[];
  tags?: string[];

  read_time?: string; // e.g., "5 min read"

  image?: string; // fallback primary image
  mediaAssets?: MediaAsset[]; // additional or rich media

  // Engagement
  comments?: number;
  likes?: number;
  shares?: number;
  views?: number;

  // Visibility & editorial flags
  status?: 'published' | 'draft' | 'archived' | 'scheduled';
  is_featured?: boolean;
  is_pinned?: boolean;
  is_draft?: boolean;
  is_scheduled?: boolean;
  is_archived?: boolean;
  is_deleted?: boolean;
  is_private?: boolean;
  is_public?: boolean;
}

export interface ContentDocument<T> {
  _id: string;
  page: string;
  section: string;
  element?: string;
  contentRole: string;
  contentType: string;
  status: string;
  visibility: string;
  content: T;
  mediaAssets?: MediaAsset[];
  metadata: {
    title: string;
    description?: string;
    keywords?: string[];
  };
  createdAt: string;
  updatedAt: string;
}
