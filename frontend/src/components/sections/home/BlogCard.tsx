'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Blogs } from '@/types/content';

interface BlogCardProps {
  blog: Blogs;
  delay?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog, delay = '100ms' }) => {
  const imageUrl = blog.image || '/assets/images/blog/blog-4-1.jpg';
  const blogSlug = blog.slug || blog.id;
  const blogDate = blog.date?.slice(0, 10) || 'Unknown Date';

  return (
    <div className="col-xl-4 col-lg-4 wow fadeInLeft" data-wow-delay={delay}>
      <div className="blog-four__single">
        <div className="blog-four__img-box">
          <div className="blog-four__img">
            <Image
              src={imageUrl}
              alt={blog.title || 'Blog Post'}
              width={400}
              height={300}
              loading="lazy"
            />
          </div>
        </div>
        <div className="blog-four__content">
          <ul className="blog-four__meta list-unstyled">
            <li>
              <Link href={`/blogs/${blogSlug}`}>
                <span className="icon-calender"></span>
                {blogDate}
              </Link>
            </li>
            <li>
              <Link href={`/blogs/${blogSlug}`}>
                <span className="icon-comments-2"></span>0
              </Link>
            </li>
          </ul>
          <h3 className="blog-four__title">
            <Link href={`/blogs/${blogSlug}`}>{blog.title}</Link>
          </h3>
          <div className="blog-four__read-more">
            <Link href={`/blogs/${blogSlug}`}>
              Read more<span className="icon-right-arrow"></span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
