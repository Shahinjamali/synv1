'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  getProductBySlug,
  updateProduct,
  getProductCategories,
  getProductSubcategories,
} from '@/utils/api';
import { Product, Category } from '@/types/products';
import { MediaAsset } from '@/types/mediaAsset';
import { toast } from 'react-toastify';

export default function ProductEditPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Partial<Product>>({
    description: { short: '', detailed: '' },
    keyFeatures: [],
  });
  const [newMediaAssets, setNewMediaAssets] = useState<File[]>([]);
  const [newMediaMetadata, setNewMediaMetadata] = useState<
    Array<Partial<MediaAsset>>
  >([]);
  const [deleteMediaAssetIds, setDeleteMediaAssetIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch product and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productRes, categoriesRes] = await Promise.all([
          getProductBySlug(slug as string),
          getProductCategories(),
        ]);
        const productData = productRes.data;
        setProduct(productData);
        setFormData({
          title: productData.title,
          slug: productData.slug,
          category: productData.category,
          subcategory: productData.subcategory,
          description: productData.description || { short: '', detailed: '' },
          keyFeatures: productData.keyFeatures || [],
        });
        const mainCategories = categoriesRes.data.items.filter(
          (c) => c.scope === 'product' && !c.isSubcategory
        );
        setCategories(mainCategories);

        if (productData.category) {
          const category = mainCategories.find(
            (c) => c._id === productData.category
          );
          if (category?.slug) {
            const subcategoriesRes = await getProductSubcategories(
              category.slug
            );
            setSubcategories(subcategoriesRes.data.items);
          }
        }
      } catch (_) {
        setError('Failed to load product or categories');
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.category && formData.category !== product?.category) {
      const fetchSubcategories = async () => {
        try {
          const category = categories.find((c) => c._id === formData.category);
          if (!category?.slug) {
            throw new Error('Category slug not found');
          }
          const subcategoriesRes = await getProductSubcategories(category.slug);
          setSubcategories(subcategoriesRes.data.items);
          setFormData((prev) => ({ ...prev, subcategory: '' }));
        } catch (_) {
          setError('Failed to load subcategories');
          toast.error('Failed to load subcategories');
        }
      };
      fetchSubcategories();
    }
  }, [formData.category, categories, product?.category]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith('description.')) {
      const field = name.split('.')[1] as 'short' | 'detailed';
      setFormData((prev) => ({
        ...prev,
        description: { ...prev.description, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle key features as an array
  const handleKeyFeaturesChange = (index: number, value: string) => {
    const updatedFeatures = [...(formData.keyFeatures || [])];
    updatedFeatures[index] = value;
    setFormData((prev) => ({ ...prev, keyFeatures: updatedFeatures }));
  };

  // Handle new media asset files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewMediaAssets(files);
      setNewMediaMetadata(files.map(() => ({ type: 'image', title: '' })));
    }
  };

  // Handle new media metadata changes
  const handleMediaMetadataChange = (
    index: number,
    field: keyof MediaAsset,
    value: string
  ) => {
    const updatedMetadata = [...newMediaMetadata];
    updatedMetadata[index] = { ...updatedMetadata[index], [field]: value };
    setNewMediaMetadata(updatedMetadata);
  };

  // Handle deleting existing media assets
  const handleDeleteMediaAsset = (assetId: string) => {
    setDeleteMediaAssetIds((prev) => [...prev, assetId]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) {
      setError('Product data not loaded');
      toast.error('Product data not loaded');
      return;
    }
    try {
      setLoading(true);
      // Validate required fields
      if (
        !formData.title ||
        !formData.slug ||
        !formData.category ||
        !formData.subcategory
      ) {
        throw new Error('Title, slug, category, and subcategory are required');
      }
      // Validate media metadata
      if (newMediaAssets.length !== newMediaMetadata.length) {
        throw new Error('Media metadata must match uploaded files');
      }
      for (const meta of newMediaMetadata) {
        if (!meta.type || !meta.title) {
          throw new Error('Each media asset requires a type and title');
        }
      }

      // Prepare form data with media assets
      const submitFormData: Partial<Product> = {
        ...formData,
        mediaAssets: newMediaMetadata,
      };

      await updateProduct(
        product._id,
        submitFormData,
        newMediaAssets,
        deleteMediaAssetIds.length > 0 ? deleteMediaAssetIds : undefined
      );
      toast.success('Product updated successfully');
      router.push('/dashboard/owner/admin/products/edit');
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to update product';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Product: {product.title}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            value={formData.slug || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategory */}
        <div>
          <label
            htmlFor="subcategory"
            className="block text-sm font-medium text-gray-700"
          >
            Subcategory
          </label>
          <select
            id="subcategory"
            name="subcategory"
            value={formData.subcategory || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={!formData.category}
            required
          >
            <option value="">Select Subcategory</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.title}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description.short"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Short)
          </label>
          <textarea
            id="description.short"
            name="description.short"
            value={formData.description?.short || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            rows={2}
          />
        </div>
        <div>
          <label
            htmlFor="description.detailed"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Detailed)
          </label>
          <textarea
            id="description.detailed"
            name="description.detailed"
            value={formData.description?.detailed || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            rows={4}
          />
        </div>

        {/* Key Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Key Features
          </label>
          {(formData.keyFeatures || []).map((feature, index) => (
            <input
              key={index}
              value={feature}
              onChange={(e) => handleKeyFeaturesChange(index, e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm mb-2"
              placeholder={`Feature ${index + 1}`}
            />
          ))}
          <button
            type="button"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                keyFeatures: [...(prev.keyFeatures || []), ''],
              }))
            }
            className="text-blue-600 hover:underline"
          >
            Add Feature
          </button>
        </div>

        {/* Existing Media Assets */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Existing Media Assets
          </label>
          {product.mediaAssets && product.mediaAssets.length > 0 ? (
            <div className="space-y-2">
              {product.mediaAssets.map((asset) => (
                <div key={asset._id} className="flex items-center">
                  <span>
                    {asset.title} ({asset.type})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteMediaAsset(asset._id!)}
                    className="ml-2 text-red-600 hover:underline"
                    disabled={deleteMediaAssetIds.includes(asset._id!)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No existing media assets</p>
          )}
        </div>

        {/* New Media Assets */}
        <div>
          <label
            htmlFor="files"
            className="block text-sm font-medium text-gray-700"
          >
            Upload New Media Assets
          </label>
          <input
            id="files"
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
          {newMediaAssets.map((file, index) => (
            <div key={index} className="mt-2 space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  File: {file.name}
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={newMediaMetadata[index]?.type || 'image'}
                  onChange={(e) =>
                    handleMediaMetadataChange(index, 'type', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="image">Image</option>
                  <option value="thumbnail">Thumbnail</option>
                  <option value="icon">Icon</option>
                  <option value="document">Document</option>
                  <option value="video">Video</option>
                  <option value="banner">Banner</option>
                  <option value="productCard">Product Card</option>
                  <option value="featureBlock">Feature Block</option>
                  <option value="verticalFeature">Vertical Feature</option>
                  <option value="heroHalf">Hero Half</option>
                  <option value="serviceCard">Service Card</option>
                  <option value="wideBanner">Wide Banner</option>
                  <option value="miniBanner">Mini Banner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  value={newMediaMetadata[index]?.title || ''}
                  onChange={(e) =>
                    handleMediaMetadataChange(index, 'title', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Alt Text
                </label>
                <input
                  value={newMediaMetadata[index]?.altText || ''}
                  onChange={(e) =>
                    handleMediaMetadataChange(index, 'altText', e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
