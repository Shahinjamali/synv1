'use client';

import React from 'react';
import ProductCard from './ProductCard';
import productsData from '@/data/home/products.json';
import { Product } from '@/types/products';

interface ProductsProps {
  products?: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const productList = products || [];

  return (
    <section className="services-nine">
      <div className="container">
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">
              {productsData.tagline}
            </span>
          </div>
          <h2
            className="section-title__title"
            dangerouslySetInnerHTML={{ __html: productsData.title }}
          />
        </div>
        {productList.length === 0 ? (
          <p className="text-center">No products available at this time.</p>
        ) : (
          <div className="row">
            {productList.map((product, index) => (
              <ProductCard
                key={product._id || index}
                product={product}
                delay={`${100 + index * 100}ms`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
