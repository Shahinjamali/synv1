'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Blogs } from '@/types/content';

interface BlogCardProps {
  blog: Blogs;
  delay?: string;
}

const PLACEHOLDER_IMAGE = '/assets/images/placeholders/blog.webp';

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return 'Unknown Date';
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? 'Unknown Date'
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
};

const BlogCard: React.FC<BlogCardProps> = ({ blog, delay = '100ms' }) => {
  const imageUrl = blog.image?.trim() || PLACEHOLDER_IMAGE;
  const blogSlug =
    typeof blog.slug === 'string' && blog.slug.trim()
      ? blog.slug
      : blog.id || 'blog-post';
  const blogDate = formatDate(blog.date);

  return (
    <div className="col-xl-4 col-lg-4 wow fadeInLeft" data-wow-delay={delay}>
      <article className="blog-four__single" aria-label={`Blog: ${blog.title}`}>
        <div className="blog-four__img-box">
          <div className="blog-four__img">
            <Image
              src={imageUrl}
              alt={blog.title || 'Blog Post'}
              width={400}
              height={300}
              loading="lazy"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        </div>
        <div className="blog-four__content">
          <ul className="blog-four__meta list-unstyled">
            <li>
              <Link href={`/blogs/${blogSlug}`}>
                <span className="icon-calender" />
                {blogDate}
              </Link>
            </li>
          </ul>
          <h3 className="blog-four__title">
            <Link href={`/blogs/${blogSlug}`}>{blog.title}</Link>
          </h3>
          <div className="blog-four__read-more">
            <Link href={`/blogs/${blogSlug}`}>
              Read more
              <span className="icon-right-arrow" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogCard;
