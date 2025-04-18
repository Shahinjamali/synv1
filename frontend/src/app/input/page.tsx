import { UnifiedDataInput } from '@/components/input/UnifiedDataInput';
import { getCategories } from '@/utils/api';
import { Category } from '@/types/category';
import Layout from '@/components/layout/Layout';

export default async function InputPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const response = await getCategories();
  console.log('Categories response:', response);
  const categories: Category[] = response.data || [];

  const defaultModelType = resolvedSearchParams.type as
    | 'product'
    | 'service'
    | 'category'
    | undefined;

  return (
    <Layout breadcrumbTitle="Data Input">
      <div className="container py-4">
        <h1 className="mb-4">Data Input</h1>
        <UnifiedDataInput
          categories={categories}
          defaultModelType={defaultModelType}
        />
      </div>
    </Layout>
  );
}
