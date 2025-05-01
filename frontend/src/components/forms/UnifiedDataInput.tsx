'use client';

import ProductForm from '@/components/forms/ProductForm';
import ServiceForm from '@/components/forms/ServiceForm';
import CategoryForm from '@/components/forms/CategoryForm';
import { Category } from '@/types/category';
import { Product } from '@/types/products';
import { Service } from '@/types/services';

interface UnifiedDataInputProps {
  modelType: 'product' | 'service' | 'category';
  initialData?: Partial<Product | Service | Category>;
  categories: Category[];
}

export default function UnifiedDataInput({
  modelType,
  initialData,
  categories,
}: UnifiedDataInputProps) {
  switch (modelType) {
    case 'product':
      return (
        <ProductForm
          initialData={initialData as Partial<Product>}
          categories={categories}
        />
      );

    case 'service':
      return (
        <ServiceForm
          initialData={initialData as Partial<Service>}
          categories={categories}
        />
      );

    case 'category':
      return (
        <CategoryForm
          initialData={initialData as Partial<Category>}
          categories={categories}
        />
      );

    default:
      return <div>Invalid model type</div>;
  }
}
