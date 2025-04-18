// src/app/products/[category]/[subcategory]/[slug]/page.tsx
import ProductDetails from '@/components/sections/Products/ProductDetails';
import { getProductBySlug } from '@/utils/api';

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; subcategory: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  const productResponse = await getProductBySlug(slug);
  const product = productResponse.data;

  return <ProductDetails product={product} />;
}
