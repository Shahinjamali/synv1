'use client';

import React from 'react';
import ProductCard from './ProductCard';
import productsData from '@/data/home/products.json';
import { Product } from '@/types/products';

interface ProductsProps {
  products?: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <section className="services-nine">
        <div className="container text-center py-12">
          <h2>{productsData.title || 'Products'}</h2>
          <p>No products available at this time.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="services-nine" aria-labelledby="homepage-products">
      <div className="container">
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">
              {productsData.tagline}
            </span>
          </div>
          <h2
            className="section-title__title"
            id="homepage-products"
            dangerouslySetInnerHTML={{ __html: productsData.title }}
          />
        </div>
        <div className="row">
          {products.map((product, index) => (
            <ProductCard
              key={product._id || index}
              product={product}
              delay={`${100 + index * 100}ms`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
