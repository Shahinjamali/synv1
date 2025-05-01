// categories main list page\n\nexport default function CategoriesPage() {\n  return <div>categories page</div>;\n}
'use client';

import { getCategories } from '@/utils/api';
import { Category } from '@/types/category';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((res) => {
        setCategories(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories Manager</h1>
      <Link href="./categories/new" className="btn-primary mb-4 inline-block">
        ➕ Add New Category
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <div className="space-y-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <div className="font-semibold">{cat.title}</div>
              <div className="text-gray-600">{cat.slug}</div>
              <Link
                href={`./categories/${cat.slug}`}
                className="text-blue-600 hover:underline"
              >
                ✏️ Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
