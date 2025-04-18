// src/app/products/[category]/[subcategory]/page.tsx
import Layout from '@/components/layout/Layout';
import ProductsList from '@/components/sections/Products/ProductsList';
import { getProductCategoryBySlug, getProducts } from '@/utils/api';
import { Product } from '@/types/products';
import { Category } from '@/types/category';
export default async function SubcategoryPage({
  params: paramsPromise,
}: {
  params: Promise<{ category: string; subcategory: string }>;
}) {
  const params = await paramsPromise;
  const { category, subcategory } = params;

  // Fetch category details for validation
  const categoryResponse = await getProductCategoryBySlug(category);
  const categoryData: Category[] = categoryResponse?.data?.items ?? [];

  if (!categoryData) {
    throw new Error(`Category "${category}" not found`);
  }

  // Fetch subcategory details
  const subcategoryResponse = await getProductCategoryBySlug(subcategory);
  const subcategoryData: Category[] = subcategoryResponse?.data?.items ?? [];

  if (!subcategoryData) {
    throw new Error(`Subcategory "${subcategory}" not found`);
  }

  // // Validate hierarchy
  // if (subcategoryData.parent?.toString() !== categoryData._id.toString()) {
  //   throw new Error(
  //     `Subcategory "${subcategory}" does not belong to category "${category}"`
  //   );
  // }

  // Fetch products for this subcategory
  const productsResponse = await getProducts({ subcategorySlug: subcategory });

  const products: Product[] = productsResponse.data?.items ?? [];

  return (
    <Layout breadcrumbTitle={`Products - ${category} - ${subcategory}`}>
      <ProductsList products={products} header={subcategoryData[0].subtitle} />
    </Layout>
  );
}
