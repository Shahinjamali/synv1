import React, { useEffect, useState } from 'react';
import ProductDetails from '@/components/sections/Products/ProductDetails';
import { getProductBySlug } from '@/utils/api';
import { Product } from '@/types/products';

const ProductContent = ({ slug }: { slug: string }) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProductBySlug(slug).then((res) => setProduct(res.data));
  }, [slug]);

  if (!product) return <div>Loading...</div>;

  return <ProductDetails product={product} />;
};

export default ProductContent;
