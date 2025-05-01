// products main list page\n\nexport default function ProductsPage() {\n  return <div>products page</div>;\n}
// src/app/dashboard/owner/[role]/products/page.tsx
'use client';

import { getProducts } from '@/utils/api';
import { Product } from '@/types/products';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({})
      .then((res) => {
        setProducts(res.data.items);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products Manager</h1>
      <Link href="./products/new" className="btn-primary mb-4 inline-block">
        ➕ Add New Product
      </Link>

      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <div className="font-semibold">{product.title}</div>
              <div className="text-gray-600">{product.slug}</div>
              <Link
                href={`./products/${product.slug}`}
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
