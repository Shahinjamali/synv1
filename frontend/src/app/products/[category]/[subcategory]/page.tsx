// src/app/products/[category]/[subcategory]/page.tsx
import Layout from '@/components/layout/Layout';
import ProductsList from '@/components/sections/Products/ProductsList';
import {
  getProductCategoryBySlug,
  getProducts,
  getCategoriesbySlug,
} from '@/utils/api';
import { Product } from '@/types/products';
import { Category } from '@/types/category';
import DescriptionCard from '@/components/common/DescriptionCard';

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
  const catData = await getCategoriesbySlug(subcategory);

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

  // Fetch products by subcategory
  const productsResponse = await getProducts({ subcategorySlug: subcategory });
  const products: Product[] = productsResponse.data?.items ?? [];

  return (
    <Layout
      breadcrumbTitle={`Products - ${parentCategory.title} - ${currentSubcategory.title}`}
    >
      <DescriptionCard details={catData.data} />
      <ProductsList
        products={products}
        header={currentSubcategory.subtitle || currentSubcategory.title}
      />
    </Layout>
  );
}
