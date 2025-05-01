'use client';

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ServiceForm from '@/components/forms/ServiceForm';
import { serviceFormSchema } from '@/schemas/serviceFormSchema';
import { mediaAssetFormSchema } from '@/schemas/mediaAssetFormSchema';
import { z } from 'zod';
import { Category } from '@/types/category';
import { createService, getCategories } from '@/utils/api'; // Assume you create similar to createProduct

type MediaAssetFormData = z.infer<typeof mediaAssetFormSchema>;

export default function NewServicePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetFormData[]>([]);

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const res = await getCategories();
        const allCategories: Category[] = res.data || [];
        const mainCategories = allCategories.filter(
          (c) => c.scope === 'service'
        );

        setCategories(mainCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again.');
        toast.error('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesAndSubcategories();
  }, []);

  const handleCreate = async (data: z.infer<typeof serviceFormSchema>) => {
    console.log('DATA', data);

    setSubmitting(true);
    setError(null);

    try {
      const validatedData = serviceFormSchema.parse(data);
      const validatedMediaAssets = mediaAssets.map((asset) =>
        mediaAssetFormSchema.parse(asset)
      );
      console.log('validatedData', validatedData);
      const formData = new FormData();

      // Append fields to FormData
      Object.entries(validatedData).forEach(([key, value]) => {
        if (key === 'mediaAssets') {
          // 🚫 Skip mediaAssets — it will be handled separately
          return;
        }

        if (value !== undefined && value !== null) {
          if (
            [
              'keyBenefits',
              'technologyUsed',
              'applicableIndustries',
              'applicableEquipment',
              'prerequisites',
            ].includes(key)
          ) {
            const arrayValue = Array.isArray(value)
              ? value
              : typeof value === 'string'
                ? value
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
                : [];
            formData.append(key, JSON.stringify(arrayValue));

            console.log('FORM DATA-1', data);
          } else if (
            [
              'description',
              'visibility',
              'reportingDetails',
              'metadata',
            ].includes(key)
          ) {
            const objectValue =
              typeof value === 'string' ? { content: value } : value;
            formData.append(key, JSON.stringify(objectValue));
          } else if (key === 'categorySlug') {
            const category = categories.find(
              (c) => c._id === validatedData.category
            );
            formData.append(key, category?.slug || '');
            console.log('FORM DATA-2', data);
          } else {
            formData.append(
              key,
              typeof value === 'string' ? value : JSON.stringify(value)
            );
            console.log('FORM DATA-3', data);
          }
        }
      });

      // Handle mediaAssets
      const validMediaAssets = validatedMediaAssets.filter(
        (asset): asset is MediaAssetFormData & { file: File } =>
          asset.file instanceof File && !!asset.file.name
      );

      if (validMediaAssets.length > 0) {
        const mediaAssetsArray = validMediaAssets.map((asset) => ({
          type: asset.type,
          title: asset.title,
          altText: asset.altText,
          description: asset.description,
          language: asset.language,
          isPrimary: asset.isPrimary,
          access: asset.access,
          restrictedRoles: asset.restrictedRoles,
          metadata: asset.metadata,
          tags: asset.tags,
        }));

        console.log('FORM DATA-4', data);

        formData.append('mediaAssets', JSON.stringify(mediaAssetsArray));

        validMediaAssets.forEach((asset) => {
          formData.append('files', asset.file, asset.file.name);
        });
      }

      for (const pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }
      // Final API call (atomic createService)
      const created = await createService(formData);

      if (!created.data.item?._id && !created.data.item?.id) {
        throw new Error('Service creation failed: Invalid response structure.');
      }

      setMediaAssets([]);
      toast.success('✅ Service and media assets saved successfully!');
    } catch (error) {
      // -- Handle and display errors --
      console.error('Submission error:', error);
      let errorMessage = 'An unknown error occurred';

      if (error instanceof z.ZodError) {
        errorMessage = 'Invalid form data. Please check your inputs.';
      } else if (
        errorMessage.includes(
          'Number of media asset metadata entries must match'
        )
      ) {
        errorMessage = 'Mismatch between uploaded files and metadata.';
      }

      setError(errorMessage);
      toast.error(`❌ ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={5000} />
      <div>
        <h1 className="text-2xl font-bold mb-6">➕ Add New Service</h1>
        <ServiceForm
          categories={categories}
          initialData={{}}
          onSubmit={handleCreate}
          submitting={submitting}
          mediaAssets={mediaAssets}
          setMediaAssets={setMediaAssets}
        />
      </div>
    </>
  );
}
