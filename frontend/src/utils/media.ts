const BASE_MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_BASE || '';

export function resolveMediaUrl(url?: string): string {
  if (!url) return '';
  if (url.startsWith('/uploads/')) {
    return `${BASE_MEDIA_URL}${url}`;
  }
  return url;
}
