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

  // Fetch category
  const categoryResponse = await getProductCategoryBySlug(category);
  const categoryData: Category[] = categoryResponse?.data?.items ?? [];

  if (!categoryData.length) {
    throw new Error(`Category "${category}" not found`);
  }

  // Fetch subcategory
  const subcategoryResponse = await getProductCategoryBySlug(subcategory);
  const subcategoryData: Category[] = subcategoryResponse?.data?.items ?? [];

  if (!subcategoryData.length) {
    throw new Error(`Subcategory "${subcategory}" not found`);
  }

  const parentCategory = categoryData[0];
  const currentSubcategory = subcategoryData[0];

  // Optional: Validate subcategory belongs to category
  // if (
  //   currentSubcategory.parent?.toString() !== parentCategory._id?.toString()
  // ) {
  //   throw new Error(
  //     `Subcategory "${subcategory}" does not belong to category "${category}"`
  //   );
  // }

  // Fetch products by subcategory
  const productsResponse = await getProducts({ subcategorySlug: subcategory });
  const products: Product[] = productsResponse.data?.items ?? [];

  return (
    <Layout
      breadcrumbTitle={`Products - ${parentCategory.title} - ${currentSubcategory.title}`}
    >
      <ProductsList
        products={products}
        header={currentSubcategory.subtitle || currentSubcategory.title}
      />
    </Layout>
  );
}
