// Add new categories\n\nexport default function AddCategoriesPage() {\n  return <div>Add new categories</div>;\n}
'use client';

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CategoryForm from '@/components/forms/CategoryForm';
import { categoryFormSchema } from '@/schemas/categoryFormSchema';
import { mediaAssetFormSchema } from '@/schemas/mediaAssetFormSchema';
import { z } from 'zod';
import { Category } from '@/types/category';
import { createCategory, getCategories } from '@/utils/api';

// Define MediaAssetFormData using the schema directly
type MediaAssetFormData = z.infer<typeof mediaAssetFormSchema>;

export default function NewcategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAssetFormData[]>([]);

  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        const res = await getCategories();
        const allCategories: Category[] = res.data || [];
        const mainCategories = allCategories.filter((c) => !c.isSubcategory);
        const subCategories = allCategories.filter((c) => c.isSubcategory);
        setCategories(mainCategories);
        setSubcategories(subCategories);
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

  const handleCreate = async (data: z.infer<typeof categoryFormSchema>) => {
    setSubmitting(true);
    setError(null);

    try {
      const validatedData = categoryFormSchema.parse(data);
      const validatedMediaAssets = mediaAssets.map((asset) =>
        mediaAssetFormSchema.parse(asset)
      );

      const formData = new FormData();

      // -- Append category fields --
      Object.entries(validatedData).forEach(([key, value]) => {
        if (key === 'mediaAssets') {
          // 🚫 Skip mediaAssets — it will be handled separately
          return;
        }

        if (value !== undefined && value !== null) {
          if (
            [
              'keyFeatures',
              'applications',
              'specifications',
              'approvals',
              'packaging',
              'compatibility',
              'relatedcategorys',
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
          } else if (
            ['description', 'compliance', 'visibility', 'metadata'].includes(
              key
            )
          ) {
            const objectValue =
              typeof value === 'string' ? { content: value } : value;
            formData.append(key, JSON.stringify(objectValue));
          } else if (key === 'categorySlug') {
            const category = categories.find(
              (c) => c._id === validatedData.category
            );
            formData.append(key, category?.slug || '');
          } else if (key === 'subcategorySlug') {
            const subcategory = subcategories.find(
              (s) => s._id === validatedData.subcategory
            );
            formData.append(key, subcategory?.slug || '');
          } else {
            formData.append(
              key,
              typeof value === 'string' ? value : JSON.stringify(value)
            );
          }
        }
      });

      // -- Append media assets only if present --
      const validMediaAssets = validatedMediaAssets.filter(
        (asset): asset is MediaAssetFormData & { file: File } =>
          asset.file instanceof File && !!asset.file.name
      );

      // Group into images and documents (optional, for better backend separation later if needed)

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

        formData.append('mediaAssets', JSON.stringify(mediaAssetsArray));

        validMediaAssets.forEach((asset) => {
          formData.append('files', asset.file, asset.file.name);
        });
      }

      // -- Submit the form --
      const created = await createCategory(formData);

      // -- Validate the backend response --
      if (!created.data.item?._id && !created.data.item?.id) {
        throw new Error(
          'category creation failed: Invalid response structure.'
        );
      }

      // -- Success State Reset --
      setMediaAssets([]);
      toast.success('✅ category and media assets saved successfully!');
    } catch (error) {
      // -- Handle and display errors --
      console.error('Submission error:', error);
      let errorMessage = 'An unknown error occurred';

      if (error instanceof z.ZodError) {
        errorMessage = 'Invalid form data. Please check your inputs.';
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
        if (errorMessage.includes('Subcategory does not belong to category')) {
          errorMessage =
            'Selected subcategory does not belong to the chosen category.';
        } else if (
          errorMessage.includes(
            'Number of media asset metadata entries must match'
          )
        ) {
          errorMessage = 'Mismatch between uploaded files and metadata.';
        }
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
    <div>
      <ToastContainer position="top-right" autoClose={5000} />
      <h1 className="text-2xl font-bold mb-6">➕ Add New Category</h1>
      <CategoryForm
        categories={categories}
        onSubmit={handleCreate}
        submitting={submitting}
        mediaAssets={mediaAssets}
        setMediaAssets={setMediaAssets}
      />
    </div>
  );
}
