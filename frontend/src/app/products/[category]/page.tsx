// src/app/products/[category]/page.tsx
import Layout from '@/components/layout/Layout';
import ProductsGrid from '@/components/sections/Products/ProductsGrid';
import {
  getCategoriesbySlug,
  getProductCategoryBySlug,
  getProductSubcategories,
} from '@/utils/api';
import { Category } from '@/types/category';
import productsHeader from '@/data/products/subCategory.json';
import DescriptionCard from '@/components/common/DescriptionCard';

export default async function CategoryPage({
  params: paramsPromise, // Rename to indicate it's a Promise
}: {
  params: Promise<{ category: string }>; // Type as Promise
}) {
  const params = await paramsPromise; // Await the params
  const { category } = params;

  // Fetch the category details
  const categoriesResponse = await getProductCategoryBySlug(category);
  const categoryData = await getCategoriesbySlug(category);

  const categories: Category[] = categoriesResponse?.data?.items ?? [];

  if (!categories) {
    throw new Error(`Category "${category}" not found`);
  }

  // Fetch subcategories
  const subcategoriesResponse = await getProductSubcategories(category);
  const subcategories: Category[] = subcategoriesResponse?.data?.items ?? [];

  return (
    <Layout breadcrumbTitle={`Products - ${category}`}>
      <DescriptionCard details={categoryData.data} />
      <ProductsGrid
        categories={subcategories}
        title={productsHeader.title}
        header={productsHeader.header}
      />
    </Layout>
  );
}
