'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/products';
import { resolveMediaUrl } from '@/utils/media';

interface ProductsListProps {
  products: Product[];
  title2?: string;
  header?: string;
}

const truncateWords = (text: string, maxWords = 10): string => {
  const words = text.split(' ');
  return words.length > maxWords
    ? words.slice(0, maxWords).join(' ') + '...'
    : text;
};

const PLACEHOLDERS = [
  '/assets/images/placeholders/metalworking-icon.webp',
  '/assets/images/placeholders/metalworking-icon-1.webp',
  '/assets/images/placeholders/metalworking-icon-2.webp',
];

export default function ProductsList({
  products,
  title2 = 'Our Products',
  header = 'What we offer',
}: ProductsListProps) {
  return (
    <section className="recent-project mt-10">
      <div className="container">
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">{header}</span>
          </div>
          <h2 className="section-title__title">{title2}</h2>
        </div>

        <ul className="recent-project__list-box list-unstyled">
          {products.length > 0 ? (
            products.map((product, index) => {
              const mediaAssets = product.mediaAssets ?? [];
              const fallback = PLACEHOLDERS[index % PLACEHOLDERS.length];

              const rawUrl = mediaAssets.find(
                (asset) => asset.type === 'icon'
              )?.url;
              const iconImage = resolveMediaUrl(rawUrl ?? fallback);

              return (
                <li
                  key={product._id}
                  className="wow fadeInUp"
                  data-wow-delay={`${100 + index * 200}ms`}
                >
                  <div className="recent-project__list-content">
                    <div className="icon">
                      <Image
                        src={iconImage}
                        alt={product.title}
                        width={50}
                        height={50}
                        layout="responsive"
                      />
                    </div>
                    <div className="content">
                      <h3>
                        <Link
                          href={`/products/${product.categorySlug}/${product.subcategorySlug}/${product.slug}`}
                        >
                          {product.title}
                        </Link>
                      </h3>
                      {product.description?.short && (
                        <p>{truncateWords(product.description.short)}</p>
                      )}
                    </div>
                  </div>
                  <div className="recent-project__btn-box">
                    <Link
                      href={`/products/${product.categorySlug}/${product.subcategorySlug}/${product.slug}`}
                      className="recent-project__btn thm-btn"
                    >
                      Read more
                      <span className="icon-dabble-arrow-right"></span>
                    </Link>
                  </div>
                </li>
              );
            })
          ) : (
            <li>No products available.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
