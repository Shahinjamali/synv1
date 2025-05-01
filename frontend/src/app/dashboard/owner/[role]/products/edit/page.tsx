// Edit products by slug\n\nexport default function EditProductsPage() {\n  return <div>Edit products page</div>;\n}
'use client';

import {
  getProducts,
  deleteProduct,
  getProductCategories,
  getProductSubcategories,
} from '@/utils/api';
import { Product } from '@/types/products';
import { Category } from '@/types/category';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function ProductsEditPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories and initial products
  useEffect(() => {
    const fetchCategoriesAndSubcategories = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const res = await getProductCategories();
        const mainCategories = res.data.items.filter(
          (c: Category) => c.scope === 'product' && !c.isSubcategory
        );
        setCategories(mainCategories);

        // Fetch initial products
        const productsRes = await getProducts({});
        setProducts(productsRes.data.items);
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

  // Fetch subcategories when a category is selected
  useEffect(() => {
    if (selectedCategory) {
      const fetchSubcategories = async () => {
        try {
          const category = categories.find((c) => c._id === selectedCategory);
          if (!category?.slug) {
            throw new Error('Category slug not found');
          }
          const subcategoriesRes = await getProductSubcategories(category.slug);
          setSubcategories(subcategoriesRes.data.items);
        } catch (error) {
          console.error('Error fetching subcategories:', error);
          setError('Failed to load subcategories.');
          toast.error('Failed to load subcategories.');
        }
      };
      fetchSubcategories();
    } else {
      setSubcategories([]);
      setSelectedSubcategory('');
    }
  }, [selectedCategory, categories]);

  // Fetch products when category or subcategory changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        const filters: any = {};
        if (selectedCategory) {
          const category = categories.find((c) => c._id === selectedCategory);
          if (category?.slug) filters.categorySlug = category.slug;
        }
        if (selectedSubcategory) {
          const subcategory = subcategories.find(
            (s) => s._id === selectedSubcategory
          );
          if (subcategory?.slug) filters.subcategorySlug = subcategory.slug;
        }

        const productsRes = await getProducts(filters);
        setProducts(productsRes.data.items);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products.');
        toast.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProducts();
  }, [selectedCategory, selectedSubcategory, categories, subcategories]);

  // Handle product deletion
  const handleDelete = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter((product) => product._id !== productId));
        toast.success('Product deleted successfully.');
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product.');
        toast.error('Failed to delete product.');
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Products</h1>

      {/* Filter Section */}
      <div className="mb-6 flex gap-4">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubcategory(''); // Reset subcategory when category changes
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="subcategory"
            className="block text-sm font-medium text-gray-700"
          >
            Subcategory
          </label>
          <select
            id="subcategory"
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            disabled={!selectedCategory}
          >
            <option value="">All Subcategories</option>
            {subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {/* Products List */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{product.title}</div>
                <div className="text-gray-600">{product.slug}</div>
              </div>
              <div className="flex gap-4">
                <Link
                  href={`./products/${product.slug}/edit`}
                  className="text-blue-600 hover:underline"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600 hover:underline"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
