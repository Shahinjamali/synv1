'use client';

import React from 'react';
import ProductCard from './ProductCard';
import productsData from '@/data/home/products.json';
import { Product } from '@/types/products';

interface ProductsProps {
  products?: Product[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  const productsList = products || [];

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
        {productsList.length === 0 ? (
          <p className="text-center">No products available at this time.</p>
        ) : (
          <div className="row">
            {productsList.map((product, index) => (
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
