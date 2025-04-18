'use client';

import React from 'react';
import BlogCard from './BlogCard';
import { Blogs } from '@/types/content';
import blogData from '@/data/home/blog.json';

interface BlogProps {
  blogs: Blogs[];
}

const Blog: React.FC<BlogProps> = ({ blogs }) => {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <section className="blog-four">
      <div className="container">
        <div className="section-title text-center">
          <div className="section-title__tagline-box">
            <span className="section-title__tagline">{blogData.tagline}</span>
          </div>
          <h2 className="section-title__title">
            {blogData.title} <br />
            {blogData.title2}
          </h2>
        </div>
        <div className="row">
          {blogs.map((blog, index) => (
            <BlogCard
              key={blog.slug || blog.title || index}
              blog={blog}
              delay={`${100 + index * 100}ms`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
