import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/products';

interface ProductCardProps {
  product: Product;
  delay?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  delay = '100ms',
}) => {
  const imageUrl =
    product?.mediaAssets?.[0]?.url ||
    '/assets/images/services/services-6-1.jpg';

  return (
    <div className="col-xl-4 col-lg-4 wow fadeInLeft" data-wow-delay={delay}>
      <div className="services-nine__single">
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
          <div className="services-nine__icon">
            <span className="icon-proconstruct" aria-hidden="true"></span>
          </div>
        </div>
        <div className="services-nine__content">
          <h3 className="services-nine__title">
            <Link href={`/products/${product.slug || product._id}`}>
              {product.title}
            </Link>
          </h3>
          <p className="services-nine__text">
            {product.description?.short || 'No description available'}
          </p>
          <div className="services-nine__read-more">
            <Link href={`/products/${product.slug || product._id}`}>
              Read More
              <span
                className="icon-dabble-arrow-right"
                aria-hidden="true"
              ></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
