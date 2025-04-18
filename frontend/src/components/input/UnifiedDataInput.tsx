'use client';
import { z, ZodSchema } from 'zod';
import { useState, useEffect, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ModelSelector } from './subcomponents/ModelSelector';
import { FieldRenderer } from './subcomponents/FieldRenderer';
import { CategorySelector } from './subcomponents/CategorySelector';
import { MediaUploader } from './subcomponents/MediaUploader';
import { MediaForm } from './subcomponents/MediaForm';
import { CropModal } from './subcomponents/CropModal';
import { categorySchema } from '@/schemas/categorySchema';
import { productSchema } from '@/schemas/productSchema';
import { serviceSchema } from '@/schemas/serviceSchema';
import { Category } from '@/types/category';
import { Service } from '@/types/services';
import { Product } from '@/types/products';
import { MediaAsset } from '@/types/mediaAsset';
import { getSubcategories } from '@/utils/api';
import { inputConfig } from '@/data/input/inputConfig';

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
  aspect?: number;
}

type SchemaMap = {
  category: typeof categorySchema;
  product: typeof productSchema;
  service: typeof serviceSchema;
};

type FormDataMap = {
  [K in keyof SchemaMap]: z.infer<SchemaMap[K]>;
};

interface UnifiedDataInputProps {
  categories: Category[];
  initialData?: Partial<Product | Service | Category>;
  defaultModelType?: 'product' | 'service' | 'category';
}

export const UnifiedDataInput = ({
  categories,
  initialData,
  defaultModelType = 'category',
}: UnifiedDataInputProps) => {
  const [modelType, setModelType] = useState<
    'product' | 'service' | 'category'
  >(defaultModelType);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [mediaAssets, setMediaAssets] = useState<
    { file?: File; metadata: Partial<MediaAsset>; crop?: CropData }[]
  >([]);
  const [isCropping, setIsCropping] = useState(false);
  const [cropConfig, setCropConfig] = useState<{
    dimension: string;
    width: number;
    height: number;
  } | null>(null);

  const schemaMap: Record<'product' | 'service' | 'category', ZodSchema> = {
    product: productSchema,
    service: serviceSchema,
    category: categorySchema,
  };

  function castInitialData<K extends keyof FormDataMap>(
    model: K,
    data: Partial<Product | Service | Category>
  ): FormDataMap[K] {
    const { ...cleaned } = data;
    return cleaned as FormDataMap[K];
  }

  const currentSchema = schemaMap[modelType];
  const typedInitialData = useMemo(
    () => ({
      parentSlug: '', // Default to empty string
      ...castInitialData(modelType, initialData ?? {}),
    }),
    [modelType, initialData]
  );

  const methods = useForm<FormDataMap[keyof FormDataMap]>({
    resolver: zodResolver(currentSchema),
    defaultValues: typedInitialData,
  });

  const {
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = methods;
  const categoryId = watch('category');

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', JSON.stringify(errors, null, 2));
    } else {
      console.log('No validation errors');
    }
  }, [errors]);

  useEffect(() => {
    if (modelType === 'product' && categoryId) {
      getSubcategories(categoryId).then((response) => {
        setSubcategories(response.data || []);
        setValue('subcategory', '');
      });
    }
  }, [categoryId, modelType, setValue]);

  useEffect(() => {
    reset(typedInitialData);
    setMediaAssets([]);
    setSubcategories([]);
  }, [modelType, typedInitialData, reset]);

  const title = watch('title');
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      setValue('slug', slug);
    }
  }, [title, setValue]);

  const onFormSubmit = async (data: FormDataMap[keyof FormDataMap]) => {
    console.log('Form data submitted:', data); // Debug log
    try {
      const mediaIds: string[] = [];
      for (const asset of mediaAssets) {
        if (asset.file) {
          const formData = new FormData();
          formData.append('file', asset.file);
          const metadata: Partial<MediaAsset> = {
            ...asset.metadata,
            metadata: {
              ...(asset.metadata.metadata || {}),
              ...(asset.crop && {
                dimensions: {
                  width: asset.crop.width,
                  height: asset.crop.height,
                },
              }),
            },
          };
          formData.append('metadata', JSON.stringify(metadata));
          const response = await fetch('/api/media/upload', {
            method: 'POST',
            body: formData,
          });
          const result = await response.json();
          if (result._id) mediaIds.push(result._id);
        }
      }

      const submitData = { ...data, mediaAssets: mediaIds, modelType };

      const baseURL =
        process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

      const endpoint =
        modelType === 'category'
          ? `${baseURL}/api/categories`
          : `${baseURL}/api/${modelType}s`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) throw new Error('Submission failed');

      reset();
      setMediaAssets([]);
      alert('Data saved successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to save data');
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <ModelSelector modelType={modelType} setModelType={setModelType} />

        {Object.entries(inputConfig[modelType].sections).map(
          ([sectionKey, fields]) => (
            <div key={sectionKey}>
              <h2 className="text-lg font-semibold capitalize mt-4 mb-2">
                {sectionKey.replace(/([A-Z])/g, ' $1')}
              </h2>
              {sectionKey === 'categorization' ? (
                <CategorySelector
                  modelType={modelType}
                  categories={categories}
                  subcategories={subcategories}
                />
              ) : sectionKey === 'media' ? (
                <>
                  <MediaUploader
                    mediaAssets={mediaAssets}
                    setMediaAssets={setMediaAssets}
                    setIsCropping={setIsCropping}
                    setCropConfig={setCropConfig}
                  />
                  <MediaForm
                    mediaAssets={mediaAssets}
                    setMediaAssets={setMediaAssets}
                  />
                </>
              ) : (
                <FieldRenderer fields={fields} />
              )}
            </div>
          )
        )}

        <div className="mt-4 flex gap-2">
          <button type="submit">Save</button>
          <button type="button" onClick={() => reset()}>
            Cancel
          </button>
        </div>
      </form>

      {isCropping && cropConfig && (
        <CropModal
          mediaAssets={mediaAssets}
          setMediaAssets={setMediaAssets}
          cropConfig={cropConfig}
          setIsCropping={setIsCropping}
          setCropConfig={setCropConfig}
        />
      )}
    </FormProvider>
  );
};
