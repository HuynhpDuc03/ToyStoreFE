import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { useNavigate } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { converPrice } from "../../utils";
import { Button, Carousel, Modal, Rate } from "antd";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import { ShoppingCartOutlined } from "@ant-design/icons";
import ProductDetailsContent from "../ProductPage/ProductDetailsModal";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ButtonFavouriteComponent from "../../components/ButtonFavouriteComponent/ButtonFavouriteComponent";
import ProductComponent from "../../components/ProductComponent/ProductComponent";

const HomePage = () => {
  const fetchProductAll = async (context) => {
    const limit = 8;
    const res = await ProductService.getAllBestSellerProduct(limit);
    return res;
  };

  const { isLoading ,data: products } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProductAll,
  });

  return (
    <LoadingComponent isLoading={isLoading}>

<Carousel autoplay>
    <div>
      <img width={"100%"} src={require('../../img/banner/banner1.webp')} alt="banner1"/>
    </div>
    <div>
    <img width={"100%"} src={require('../../img/banner/banner2.webp')} alt="banner2"/>

    </div>
    <div>
    <img width={"100%"} src={require('../../img/banner/Banner3.webp')} alt="banner3"/>

    </div>
    <div>
    <img width={"100%"} src={require('../../img/banner/Banner4.webp')} alt="banner4"/>

    </div>
  </Carousel>
    

      {/*<!-- Product Section Begin --> */}
      <section className="product spad" style={{ marginTop: 20 }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <ul className="filter__controls">
                <li className="active" data-filter="*">
                  Best Sellers
                </li>
              </ul>
            </div>
          </div>
          <div className="row product__filter">
          {products?.data?.map((product) => {
                  return (
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
                  );
                })}
          </div>
        </div>
      </section>
      {/* <!-- Product Section End -->*/}
    </LoadingComponent>
  );
};
export default HomePage;
