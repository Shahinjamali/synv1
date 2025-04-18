// src/components/sections/Products/ProductCard.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/types/category';

interface ProductCardProps {
  category: Category;
}

const ProductCard: React.FC<ProductCardProps> = ({ category }) => {
  // Determine the parent category slug for top-level categories
  const parentSlug = category.isSubcategory ? 'metalworkingfluids' : ''; // Adjust based on parent logic
  const basePath = category.isSubcategory
    ? `/products/${parentSlug}`
    : '/products';

  const imageUrl =
    category?.mediaAssets?.[0]?.url ||
    '/assets/images/services/services-6-1.jpg';

  return (
    <div className="services-four__single">
      <div className="services-four__img">
        <Image src={imageUrl} alt={category.title} width={400} height={300} />
      </div>
      <div className="services-four__content">
        <h5 className="services-four__title">
          <Link href={`${basePath}/${category.slug}`}>{category.title}</Link>
        </h5>
        {category.subtitle && (
          <p className="services-four__text">{category.subtitle}</p>
        )}
        <p className="services-four__text">{category.description.short}</p>
        <div className="services-four__btn-box">
          <Link
            href={`${basePath}/${category.slug}`}
            className="services-four__btn"
          >
            Read more
            <span className="icon-dabble-arrow-right"></span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
