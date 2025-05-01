import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/products';

const PLACEHOLDER_IMAGE = '/assets/images/placeholders/product.webp';

interface ProductCardProps {
  product: Product;
  delay?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  delay = '100ms',
}) => {
  const imageUrl =
    Array.isArray(product.mediaAssets) && product.mediaAssets.length > 0
      ? (product.mediaAssets.find((asset) => asset.type === 'productCard')
          ?.url ?? PLACEHOLDER_IMAGE)
      : PLACEHOLDER_IMAGE;

  const isValidLink =
    product?.slug && product?.categorySlug && product?.subcategorySlug;
  const hrefUrl = isValidLink
    ? `/products/${product.categorySlug}/${product.subcategorySlug}/${product.slug}`
    : '/products';

  return (
    <div className="col-xl-4 col-lg-4 wow fadeInLeft" data-wow-delay={delay}>
      <article
        className="services-nine__single"
        aria-label={`Product: ${product.title}`}
      >
        <div className="services-nine__img-box">
          <div className="services-nine__img">
            <Image
              src={imageUrl}
              alt={`${product.title} - Innovative industrial solution`}
              width={400}
              height={300}
              loading="lazy"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
        <div className="services-nine__content">
          <h3 className="services-nine__title">
            <Link href={hrefUrl}>{product.title}</Link>
          </h3>
          <p className="services-nine__text">
            {product.description?.short || 'No description available.'}
          </p>
          <div className="services-nine__read-more">
            <Link href={hrefUrl}>
              Read More
              <span className="icon-dabble-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ProductCard;
