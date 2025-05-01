'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/products';
import { MediaAsset } from '@/types/mediaAsset';

interface ProductsListProps {
  products: Product[];
  title2?: string;
  header?: string;
}

// Optional: truncate description to avoid overflow
const truncateWords = (text: string, maxWords = 15): string => {
  const words = text.split(' ');
  return words.length > maxWords
    ? words.slice(0, maxWords).join(' ') + '...'
    : text;
};

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
              const mediaAsset = Array.isArray(product.mediaAssets)
                ? product.mediaAssets.find(
                    (a): a is MediaAsset =>
                      typeof a === 'object' && a.type === 'productCard'
                  )
                : null;

              const imageUrl =
                mediaAsset?.url ||
                '/assets/images/placeholders/productList.webp';

              return (
                <li
                  key={product._id}
                  className="wow fadeInUp"
                  data-wow-delay={`${100 + index * 200}ms`}
                >
                  <div className="recent-project__img">
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      width={100}
                      height={100}
                      layout="responsive"
                    />
                  </div>
                  <div className="recent-project__list-content">
                    <div className="icon">
                      <span
                        className={`icon-${
                          index % 3 === 0
                            ? 'architect'
                            : index % 3 === 1
                              ? 'blueprint-2'
                              : 'blueprint-1'
                        }`}
                      ></span>
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
