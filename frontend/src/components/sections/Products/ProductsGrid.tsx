'use client';
import React from 'react';
import ProductCard from './ProductCard';
import { Category } from '@/types/category';

interface ProductsGridProps {
  categories: Category[];
  title?: string;
  header?: string;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  categories,
  title = 'Our Product Categories',
  header = 'What we offer',
}) => {
  const hasCategories = categories?.length > 0;

  return (
    <section className="services-page">
      <div className="container">
        {/* Section Header */}
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">{header}</span>
          </div>
          <h2 className="section-title__title">{title}</h2>
        </div>

        {/* Category Cards */}
        <div className="row">
          {hasCategories ? (
            categories.map((category) => (
              <div key={category._id} className="col-xl-4 col-lg-4 col-md-6">
                <ProductCard category={category} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p>No product categories found at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductsGrid;
