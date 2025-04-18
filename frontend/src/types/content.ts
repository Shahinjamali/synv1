// @/types/content.ts
export interface TestimonialData {
  name: string;
  company: string;
  position: string;
  quote: string;
  rating: number;
  img: string;
}

export interface Blogs {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  image?: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  comments?: number;
  likes?: number;
  shares?: number;
  views?: number;
  read_time?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  status?: string;
  is_featured?: boolean;
  is_pinned?: boolean;
  is_draft?: boolean;
  is_scheduled?: boolean;
  is_archived?: boolean;
  is_deleted?: boolean;
  is_private?: boolean;
  is_public?: boolean;
}
