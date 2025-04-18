'use client';
import React from 'react';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import Image from 'next/image'; // Import the Next.js Image component

interface BlogProps {
  // Add any props your component expects here, if any.
}

const Blogs: React.FC<BlogProps> = () => {
  return (
    <>
      <Layout breadcrumbTitle="Blog">
        {/*Blog Page Start*/}
        <section className="blog-page">
          <div className="container">
            <div className="row">
              <div className="col-xl-8 col-lg-8">
                <div className="blog-page__left">
                  {/*Blog Page Single Start*/}
                  <div className="blog-page__single">
                    <div className="blog-page__img-box">
                      <div className="blog-page__img">
                        <Image
                          src="/assets/images/blog/blog-page-1-1.jpg" // Ensure path is correct
                          alt=""
                          width={700} // Adjust width as needed
                          height={500} // Adjust height as needed
                        />
                      </div>
                    </div>
                    <div className="blog-page__content">
                      <ul className="blog-page__meta list-unstyled">
                        <li>
                          <Link href="#">
                            <span className="icon-calender"></span>
                            October 19, 2022
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="icon-user"></span>
                            By admin
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="icon-folder"></span>
                            Category
                          </Link>
                        </li>
                      </ul>
                      <h3 className="blog-page__title">
                        <Link href="/blog-details">
                          Crafting Structures that is a Stand the of Time
                        </Link>
                      </h3>
                      <p className="blog-page__text">
                        If you take a moment of your time to study the green
                        market, you will realize why company in this a niche has
                        to consider Catchy Solar Energy Slogansfor year in the
                        last 20 years, it has boost
                      </p>
                      <div className="blog-page__btn-box">
                        <Link
                          href="/blog-details"
                          className="blog-page__btn thm-btn"
                        >
                          Read more
                          <span className="icon-dabble-arrow-right"></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/*Blog Page Single End*/}
                  {/*Blog Page Single Start*/}
                  <div className="blog-page__single">
                    <div className="blog-page__img-box">
                      <div className="blog-page__img">
                        <Image
                          src="/assets/images/blog/blog-page-1-2.jpg" // Ensure path is correct
                          alt=""
                          width={700} // Adjust width as needed
                          height={500} // Adjust height as needed
                        />
                      </div>
                    </div>
                    <div className="blog-page__content">
                      <ul className="blog-page__meta list-unstyled">
                        <li>
                          <Link href="#">
                            <span className="icon-calender"></span>
                            October 19, 2022
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="icon-user"></span>
                            By admin
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="icon-folder"></span>
                            Category
                          </Link>
                        </li>
                      </ul>
                      <h3 className="blog-page__title">
                        <Link href="/blog-details">
                          Building Trust Building the with Relationships
                        </Link>
                      </h3>
                      <p className="blog-page__text">
                        If you take a moment of your time to study the green
                        market, you will realize why company in this a niche has
                        to consider Catchy Solar Energy Slogansfor year in the
                        last 20 years, it has boost
                      </p>
                      <div className="blog-page__btn-box">
                        <Link
                          href="/blog-details"
                          className="blog-page__btn thm-btn"
                        >
                          Read more
                          <span className="icon-dabble-arrow-right"></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/*Blog Page Single End*/}
                  {/*Blog Page Single Start*/}
                  <div className="blog-page__single">
                    <div className="blog-page__img-box">
                      <div className="blog-page__img">
                        <Image
                          src="/assets/images/blog/blog-page-1-3.jpg" // Ensure path is correct
                          alt=""
                          width={700} // Adjust width as needed
                          height={500} // Adjust height as needed
                        />
                      </div>
                    </div>
                    <div className="blog-page__content">
                      <ul className="blog-page__meta list-unstyled">
                        <li>
                          <Link href="#">
                            <span className="icon-calender"></span>
                            October 19, 2022
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="icon-user"></span>
                            By admin
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="icon-folder"></span>
                            Category
                          </Link>
                        </li>
                      </ul>
                      <h3 className="blog-page__title">
                        <Link href="/blog-details">
                          Construction with Precision and there Passion
                        </Link>
                      </h3>
                      <p className="blog-page__text">
                        If you take a moment of your time to study the green
                        market, you will realize why company in this a niche has
                        to consider Catchy Solar Energy Slogansfor year in the
                        last 20 years, it has boost
                      </p>
                      <div className="blog-page__btn-box">
                        <Link
                          href="/blog-details"
                          className="blog-page__btn thm-btn"
                        >
                          Read more
                          <span className="icon-dabble-arrow-right"></span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  {/*Blog Page Single End*/}
                  <div className="blog-page__pagination">
                    <ul className="pg-pagination list-unstyled">
                      <li className="count">
                        <Link href="/blog-details">1</Link>
                      </li>
                      <li className="count">
                        <Link href="/blog-details">2</Link>
                      </li>
                      <li className="count">
                        <Link href="/blog-details">3</Link>
                      </li>
                      <li className="count">
                        <Link href="/blog-details">4</Link>
                      </li>
                      <li className="next">
                        <Link href="#" aria-label="Next">
                          <i className="icon-angle-left"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-4">
                <div className="sidebar">
                  <div className="sidebar__single sidebar__search">
                    <h3 className="sidebar__title">Search</h3>
                    <form action="#" className="sidebar__search-form">
                      <input type="search" placeholder="Search..." />
                      <button type="submit">
                        <i className="icon-search"></i>
                      </button>
                    </form>
                  </div>
                  <div className="sidebar__single sidebar__post">
                    <h3 className="sidebar__title">Recent Post</h3>
                    <ul className="sidebar__post-list list-unstyled">
                      <li>
                        <div className="sidebar__post-image">
                          <Image
                            src="/assets/images/blog/lp-1-1.jpg" // Ensure path is correct
                            alt=""
                            width={100} // Adjust width as needed
                            height={100} // Adjust height as needed
                          />
                        </div>
                        <div className="sidebar__post-content">
                          <h3>
                            <Link href="/blog-details">
                              Building Your Dreams Our the Priority
                            </Link>
                          </h3>
                          <p className="sidebar__post-date">
                            <i className="icon-calender-2"></i>
                            20 Aug,2022
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="sidebar__post-image">
                          <Image
                            src="/assets/images/blog/lp-1-2.jpg" // Ensure path is correct
                            alt=""
                            width={100} // Adjust width as needed
                            height={100} // Adjust height as needed
                          />
                        </div>
                        <div className="sidebar__post-content">
                          <h3>
                            <Link href="/blog-details">
                              Excellence in Construction the Every Project
                            </Link>
                          </h3>
                          <p className="sidebar__post-date">
                            <i className="icon-calender-2"></i>
                            20 Aug,2022
                          </p>
                        </div>
                      </li>
                      <li>
                        <div className="sidebar__post-image">
                          <Image
                            src="/assets/images/blog/lp-1-3.jpg" // Ensure path is correct
                            alt=""
                            width={100} // Adjust width as needed
                            height={100} // Adjust height as needed
                          />
                        </div>
                        <div className="sidebar__post-content">
                          <h3>
                            <Link href="/blog-details">
                              Crafting Structures that Stand the Test of Time
                            </Link>
                          </h3>
                          <p className="sidebar__post-date">
                            <i className="icon-calender-2"></i>
                            20 Aug,2022
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="sidebar__single sidebar__category">
                    <h3 className="sidebar__title">Category</h3>
                    <ul className="sidebar__category-list list-unstyled">
                      <li>
                        <Link href="#">
                          <span className="icon-folder"></span>
                          Elite Builders
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="icon-folder"></span>
                          MasterCraft Construction
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="icon-folder"></span>
                          BuildTech Solutions
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="icon-folder"></span>
                          Constructive Innovations
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span className="icon-folder"></span>
                          Prestige Construction
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="sidebar__single sidebar__tags">
                    <h3 className="sidebar__title">Tags</h3>
                    <div className="sidebar__tags-list">
                      <Link href="#">Renovate</Link>
                      <Link href="#">ConstructoPro</Link>
                      <Link href="#">Harvest</Link>
                      <Link href="#">PrimeBuild</Link>
                      <Link href="#">BuildWise</Link>
                      <Link href="#">Craftsmen</Link>
                      <Link href="#">Builders</Link>
                      <Link href="#">Construction</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*Blog Page End*/}

        {/*CTA One Start*/}
        <section className="cta-one">
          <div className="container">
            <div className="cta-one__inner">
              <div className="cta-one__shape-1">
                <Image
                  src="/assets/images/shapes/cta-one-shape-1.png" // Ensure path is correct
                  alt=""
                  width={100} // Adjust width as needed
                  height={100} // Adjust height as needed
                />
              </div>
              <div className="cta-one__img">
                <Image
                  src="/assets/images/resources/cta-one-img.png" // Ensure path is correct
                  alt=""
                  width={500} // Adjust width as needed
                  height={400} // Adjust height as needed
                />
              </div>
              <h3 className="cta-one__title">
                Craftin digital experiences
                <br /> With that inspire
              </h3>
              <div className="cta-one__from-box">
                <form className="cta-one__form">
                  <div className="cta-one__input-box">
                    <input
                      type="email"
                      placeholder="Your E-mail"
                      name="email"
                    />
                  </div>
                  <button type="submit" className="cta-one__btn thm-btn">
                    Subscribe Us
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
        {/*CTA One End*/}
      </Layout>
    </>
  );
};

export default Blogs;
