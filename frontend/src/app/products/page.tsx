// src/app/products/page.tsx
import Layout from '@/components/layout/Layout';
import ProductsAbout from '@/components/sections/Products/ProductsAbout';
import ProductsGrid from '@/components/sections/Products/ProductsGrid';
import CtaOne from '@/components/common/CtaOne';
import { getProductCategories } from '@/utils/api';
import productsHeader from '@/data/products/category.json';
import { Category } from '@/types/category';

export default async function ProductsPage() {
  const categoriesResponse = await getProductCategories();

  const categories: Category[] = categoriesResponse?.data?.items ?? [];

  return (
    <Layout breadcrumbTitle="Products">
      <ProductsAbout />
      <ProductsGrid
        categories={categories}
        title={productsHeader.title}
        header={productsHeader.header}
      />
      <CtaOne />
    </Layout>
  );
}
