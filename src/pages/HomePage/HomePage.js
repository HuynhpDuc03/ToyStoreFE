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
                    <Product
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
const Product = (props) => {
  const { image, name, price, rating, discount, selled, id } = props;
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleDetailsProduct = (id) => {
    navigate(`/productsDetail/${id}`);
  };
  const formatSelled = (selled) => {
    if (selled > 1000) {
      const formattedNumber = (selled / 1000).toFixed(1);
      return `${formattedNumber}k`;
    } else {
      return selled.toString();
    }
  };
  const discountedPrice = price * (1 - discount / 100);
  return (
    <div className="col-lg-3 col-md-6 col-sm-6 col-md-6 col-sm-6 mix new-arrivals border-shadow" style={{ marginTop:"5px",marginBottom:"5px"}}>
     <div style={{ marginBottom:"15px"}}>
        <div
          className="product__item__pic set-bg"
          style={{
            backgroundImage: `url(${require("../../img/product/" + image)})`,
            cursor: "pointer",
          }}
          onClick={() => handleDetailsProduct(id)}
        >
          <span className="label" style={{ color: "red" }}>
            YÊU THÍCH
          </span>
        </div>
        <div className="product__item__text">
          <h6
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            {name}
          </h6>

          <div style={{ display: "flex", alignItems: "baseline" }}>
            <strong style={{ color: "rgb(255, 123, 2)" }}>
              {converPrice(discountedPrice)}
            </strong>
            <span
              style={{
                color: "rgba(0, 0, 0, .54)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "65px", // Adjust this value based on your needs
                textDecoration: "line-through",
                marginLeft: "3px",
                marginRight: "2px",
              }}
            >
              {converPrice(price)}
            </span>
            <span style={{ fontSize: "14px", color: "red", backgroundColor:"#feeeea" }}>
              -{discount}%
            </span>
          </div>
          <Rate disabled defaultValue={rating} style={{ fontSize: "12px" }} />{" "}
          <span style={{ fontSize: "12px" }}>
            Đã bán: {formatSelled(selled)}
          </span>
        </div>
        <Button icon={<ShoppingCartOutlined style={{fontSize:"18px"}}/>} onClick={() => setOpen(true)} type="default" className="primary-btn" style={{width:"50%", maxHeight:"100%"}}>
      
      </Button>
      <Modal
        title="Thông tin sản phẩm"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={1200}
        style={{ top: 20 }}
      >
        <ProductDetailsContent
          id={id} 
         
        />
      </Modal>
      </div>
    </div>
  );
};
