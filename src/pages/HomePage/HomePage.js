import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { Link } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import * as BlogService from "../../services/BlogService";
import { useQuery } from "@tanstack/react-query";
import { formatDateBlog } from "../../utils";
import { Carousel } from "antd";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import ProductComponent from "../../components/ProductComponent/ProductComponent";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t } = useTranslation();
  const limit = 8;

  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct(null, limit);
    return res;
  };

  const fetchAllSpecialProducts = async () => {
    const res = await ProductService.getAllSpecialProducts(4);
    console.log("bestseller", res);
    return res;
  };
  const { isLoading: abc, data: abcs } = useQuery({
    queryKey: ["productsdada"],
    queryFn: fetchAllSpecialProducts,
  });

  const fetchBlog = async () => {
    const res = await BlogService.getAllBlogs(1, 3);
    return res;
  };

  const { isLoading, data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
  });
  const { data: blogs } = useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlog,
  });

  const [filter, setFilter] = useState("bestSeller");

  const filteredProducts = products?.data?.filter((product) => {
    if (filter === "bestSeller") {
      return product.bestSeller === true;
    } else if (filter === "hotSale") {
      return product.hotSale === true;
    } else if (filter === "newArrivals") {
      return product.newArrivals === true;
    }
    return product;
  });

  return (
    <LoadingComponent isLoading={isLoading}>
      <Carousel autoplay>
        <div>
          <img
            width={"100%"}
            src={require("../../img/banner/banner1.webp")}
            alt="banner1"
          />
        </div>
        <div>
          <img
            width={"100%"}
            src={require("../../img/banner/banner2.webp")}
            alt="banner2"
          />
        </div>
        <div>
          <img
            width={"100%"}
            src={require("../../img/banner/Banner3.webp")}
            alt="banner3"
          />
        </div>
        <div>
          <img
            width={"100%"}
            src={require("../../img/banner/Banner4.webp")}
            alt="banner4"
          />
        </div>
      </Carousel>

      <section class="banner spad">
        <div class="container">
          <div class="row">
            <div class="col-lg-7 offset-lg-4">
              <div class="banner__item">
                <div class="banner__item__pic">
                  <img
                    width={440}
                    height={440}
                    src={require("../../img/instagram/inslego6.jpg")}
                    alt=""
                  />
                </div>
                <div class="banner__item__text">
                  <h2>{t("pageHome.LegoCollection")}</h2>
                  <a href="#">{t("pageHome.shopNow")}</a>
                </div>
              </div>
            </div>
            <div class="col-lg-5">
              <div class="banner__item banner__item--middle">
                <div class="banner__item__pic">
                  <img
                    src={require("../../img/product/ZD-Original-X-men-Deadpool-Wolve.jpg")}
                    alt=""
                  />
                </div>
                <div class="banner__item__text">
                  <h2>{t("pageHome.SuperHero")}</h2>
                  <a href="#">{t("pageHome.shopNow")}</a>
                </div>
              </div>
            </div>
            <div class="col-lg-7">
              <div class="banner__item banner__item--last">
                <div class="banner__item__pic">
                  <img
                    width={480}
                    height={440}
                    src={require("../../img/product/Xe-mo-hinh-bmw.jpg")}
                    alt=""
                  />
                </div>
                <div class="banner__item__text">
                  <h2>{t("pageHome.CarCollection")}</h2>
                  <a href="#">{t("pageHome.shopNow")}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/*<!-- Product Section Begin --> */}

      <section class="product spad">
        <div class="container">
          <div class="row">
            <div class="col-lg-12">
              <ul className="filter__controls">
                <li
                  className={filter === "bestSeller" ? "active" : ""}
                  onClick={() => setFilter("bestSeller")}
                >
                  Best Sellers
                </li>
                <li
                  className={filter === "newArrivals" ? "active" : ""}
                  onClick={() => setFilter("newArrivals")}
                >
                  New Arrivals
                </li>
                <li
                  className={filter === "hotSale" ? "active" : ""}
                  onClick={() => setFilter("hotSale")}
                >
                  Hot Sales
                </li>
              </ul>
            </div>
          </div>
          <div class="row product__filter">
            {filteredProducts?.map((product) => (
              <ProductComponent
                key={product._id}
                countInStock={product.countInStock}
                description={product.description}
                image={product.image[0]}
                name={product.name}
                price={product.price}
                rating={product.rating}
                type={product.type}
                discount={product.discount}
                selled={product.selled}
                id={product._id}
              />
            ))}
          </div>
        </div>
      </section>

      {/* <!-- Product Section End -->*/}

      <section className="instagram spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="instagram__pic">
                <div
                  className="instagram__pic__item set-bg"
                  style={{
                    backgroundImage: `url(${require("../../img/instagram/inslego1.jpg")})`,
                  }}
                ></div>
                <div
                  className="instagram__pic__item set-bg"
                  style={{
                    backgroundImage: `url(${require("../../img/instagram/inslego2.jpg")})`,
                  }}
                ></div>
                <div
                  className="instagram__pic__item set-bg"
                  style={{
                    backgroundImage: `url(${require("../../img/instagram/inslego3.jpg")})`,
                  }}
                ></div>
                <div
                  className="instagram__pic__item set-bg"
                  style={{
                    backgroundImage: `url(${require("../../img/instagram/inslego4.jpg")})`,
                  }}
                ></div>
                <div
                  className="instagram__pic__item set-bg"
                  style={{
                    backgroundImage: `url(${require("../../img/instagram/inslego5.jpg")})`,
                  }}
                ></div>
                <div
                  className="instagram__pic__item set-bg"
                  style={{
                    backgroundImage: `url(${require("../../img/instagram/inslego6.jpg")})`,
                  }}
                ></div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="instagram__text">
                <h2>Instagram LEGO</h2>
                <p>{t("pageHome.instagramDescription")}</p>
                <h3>#TOY_STORE</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="latest spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <span>{t("pageHome.news")}</span>
                <h2>{t("pageHome.Trend")}</h2>
              </div>
            </div>
          </div>
          <div className="row">
            {blogs?.data?.slice(0, 3)?.map((blog) => {
              return (
                <div className="col-lg-4 col-md-6 col-sm-6" key={blog._id}>
                  <div className="blog__item">
                    <div
                      className="blog__item__pic set-bg"
                      style={{
                        backgroundImage: `url(${blog.bannerImage})`,
                      }}
                    ></div>
                    <div className="blog__item__text">
                      <span>
                        <img
                          src={require("../../img/icon/calendar.png")}
                          alt="calendar icon"
                        />{" "}
                        {formatDateBlog(blog.createdAt)}
                      </span>
                      <h5>{blog.title}</h5>
                      <Link to={`/blogDetails/${blog._id}`}>
                        {t("pageHome.readMore")}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </LoadingComponent>
  );
};
export default HomePage;
