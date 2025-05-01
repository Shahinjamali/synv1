// src/data/defaults/defaultMediaAssetFormValues.ts
import { MediaAsset } from '@/types/mediaAsset';

export const defaultMediaAssetFormValues: Partial<MediaAsset> = {
  // file‐type fields
  type: 'image', // default to image
  url: '', // will be filled after upload
  format: '', // e.g. "png", "pdf"… overridden automatically
  size: 0, // bytes

  // accessibility & meta
  altText: '',
  title: '',
  description: '',

  // localization & access
  language: 'en',
  isPrimary: false,
  access: 'public',
  restrictedRoles: [],

  // nested metadata object
  metadata: {
    documentType: undefined, // e.g. "SDS", "TDS"…
    version: '',
    publicationDate: '', // ISO string
    dimensions: { width: 0, height: 0 },
    duration: 0, // for videos
  },

  // ownership (you’ll override `id` to the newly created entity)
  owner: {
    type: 'product', // or "category" when used in that form
    id: '',
  },

  tags: [], // any free‐form tags
};
