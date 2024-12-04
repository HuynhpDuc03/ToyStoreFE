import React, { useEffect, useState } from "react";
import { Button, Image, InputNumber, Rate, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { converPrice } from "../../utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import ProductImagesSlider from "../../components/ProductImageSliderCompoent/ProductImagesSlider";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { ShoppingCartOutlined } from "@ant-design/icons";
import ButtonFavouriteComponent from "../../components/ButtonFavouriteComponent/ButtonFavouriteComponent";
import {
  addFavoriteProduct,
  removeFavoriteProduct,
} from "../../redux/slides/favoriteSlide";
import { useTranslation } from "react-i18next";

const ProductDetailsContent = ({ id }) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
  const favoriteItems = useSelector((state) => state.favorite.favoriteItems);

  const navigate = useNavigate();

  const location = useLocation();
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);

  const [numProduct, setNumProduct] = useState(1);
  const formatSelled = (selled) => {
    if (selled > 1000) {
      const formattedNumber = (selled / 1000).toFixed(1);
      return `${formattedNumber}k`;
    } else {
      return selled.toString();
    }
  };
  const onChange = (value) => {
    setNumProduct(Number(value));
  };
  const fetchGetDetailsProduct = async () => {
    const res = await ProductService.getDetailsProduct(id);
    return { product: res.data.product, rating: res.data.rating };
  };
  const { isLoading, data } = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchGetDetailsProduct,
  });
  const productDetails = data?.product;
  const productRating = data?.rating;




  useEffect(() => {
    const orderRedux = order?.orderItems?.find(
      (item) => item.product === productDetails?._id
    );
    if (
      orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
      (!orderRedux && productDetails?.countInStock > 0)
    ) {
      setErrorLimitOrder(false);
    } else if (productDetails?.countInStock === 0) {
      setErrorLimitOrder(true);
    }
  }, [numProduct]);

  useEffect(() => {
    const isFavourite = favoriteItems.some(
      (item) => item.product === productDetails?._id
    );
    setFavourite(isFavourite);
  }, [favoriteItems, productDetails]);

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      localStorage.setItem("redirectURL", location.pathname);
      navigate("/SignIn", { state: location?.pathname });
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      );
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image[0],
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock,
            },
          })
        );
        message.destroy()
        message
          .open({
            type: "loading",
            content: "Loading...",
            duration: 0.75,
          })
          .then(() =>
            message.success(t("pageProductDetails.addedToCart"), 1.5)
          );
      } else {
        message.destroy()
        message.error(t("pageProductDetails.errorToCart"), 1.5);
      }
    }
  };
  const handleFavoriteClick = () => {
    if (!user?.id) {
      localStorage.setItem("redirectURL", location.pathname);
      navigate("/SignIn", { state: location?.pathname });
    } else {
      if (favourite) {
        dispatch(removeFavoriteProduct({ idProduct: productDetails?._id }));
        message.destroy()
        message.info(t("pageProductDetails.removeFavorite"), 1.5);
      } else {
        dispatch(
          addFavoriteProduct({
            favoriteItem: {
              name: productDetails?.name,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInStock: productDetails?.countInStock,
              rating: productDetails?.rating,
              selled: productDetails?.selled,
            },
          })
        );
        message.destroy()
        message.success(t("pageProductDetails.addToFavorite"), 1.5);
      }
      setFavourite(!favourite);
    }
  };

  const discountedPrice =
    productDetails?.price * (1 - productDetails?.discount / 100);

  const [favourite, setFavourite] = useState(false);

  const handleBuyNow = () => {
    const productInfo = {
      id: productDetails._id,
      name: productDetails.name,
      price: productDetails.price,
      quantity: numProduct,  
    };
    
    navigate("/checkout", { state: { productInfo } });
  };



  return (
    <>
      {isLoading ? (
        <LoadingComponent isLoading={isLoading} />
      ) : (
        <div>
          <hr />
          <div className="container">
            <div className="row  ">
              <div className="col-md-6 mt-3">
                <ProductImagesSlider images={productDetails?.image} />
              </div>
              <div className="col-md-6 mt-4">
                <div className="product__details__text">
                  <h4>{productDetails?.name}</h4>
                  <Rate
                    disabled
                    value={productDetails?.rating}
                    style={{ fontSize: "16px" }}
                  />
                  <span
                    style={{
                      marginLeft: "10px",
                      borderBottom: "1px solid #555",
                      borderBottomColor: "#ee4d2d",
                    }}
                  >
                    {productDetails?.rating}
                  </span>{" "}
                  |
                  <span>
                    {" "}
                    {formatSelled(productDetails?.selled)}{" "}
                    {t("pageProductDetails.selled")}
                  </span>{" "}
                  |{" "}
                  <span>
                    {" "}
                    {formatSelled(productDetails?.viewCount)}{" "}
                    {t("pageProductDetails.viewCount")}
                  </span>
                  <h3>
                    {converPrice(discountedPrice)}

                    {productDetails?.discount > 0 && (
                      <>
                        <span style={{ fontSize: "16px" }}>
                          {converPrice(productDetails?.price)}
                        </span>
                        <span
                          style={{
                            fontSize: "16px",
                            color: "#fff",
                            backgroundColor: "#d0011b",
                            textDecoration: "none",
                            borderRadius: "2px",
                            padding: "2px 4px",
                          }}
                        >
                          {productDetails?.discount}%{" "}
                          {t("pageProductDetails.discount")}
                        </span>
                      </>
                    )}
                  </h3>
                  <p>
                    Siêu chiến giáp của Cole có buồng lái và được trang bị một
                    cây búa để chiến đấu với những tên Chiến binh Sói gian ác.
                    Và bây giờ, bạn có thể kết hợp các bộ phận của 3 cỗ máy
                    ninja tuyệt vời do Cole, Sora và Kai điều khiển để tạo ra cỗ
                    máy kết hợp của riêng bạn.
                  </p>
                  <div className="product__details__cart__option">
                    {productDetails?.countInStock > 0 ? (
                      <div className="row">
                        <div className="col-md-7">
                          <InputNumber
                            style={{ marginRight: "10px" }}
                            min={1}
                            max={productDetails?.countInStock}
                            defaultValue={1}
                            value={numProduct}
                            onChange={onChange}
                          />
                          <span>
                            {productDetails?.countInStock}{" "}
                            {t("pageProductDetails.countInStock")}
                          </span>
                        </div>
						{/*
                        <div className="col-md-5">
                          <ButtonComponent
                            style={{ height: "48px", width: "100%" }}
                            onClick={handleBuyNow}
                          >
                            MUA NGAY
                          </ButtonComponent>
                        </div>
						*/}
                      </div>
                    ) : (
                      <h5 style={{ color: "rgb(255, 123, 2)" }}>
                        {t("pageProductDetails.countOutstanding")}
                      </h5>
                    )}
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <Button
                        size="large"
                        type="primary"
                        onClick={handleAddOrderProduct}
                        style={{ height: "48px", width: "100%" }}
                      >
                        <ShoppingCartOutlined
                          style={{
                            display: "inline-flex",
                            marginRight: "5px",
                          }}
                        />{" "}
                        {t("pageProductDetails.addToCart")}
                      </Button>
                    </div>
                    <div className="col-md-6">
                      <ButtonFavouriteComponent
                        onClick={handleFavoriteClick}
                        style={{
                          height: "48px",
                          background: "#fff",
                          color: "#ff0000",
                          borderColor: "#ff0000",
                        }}
                        isFavourite={favourite}
                      >
                        {t("pageProductDetails.favorite")}
                      </ButtonFavouriteComponent>
                    </div>
                  </div>
                  <div className="product__details__last__option">
                    <ul>
                      <li>
                        <span>{t("pageProductDetails.idProduct")}:</span>{" "}
                        {productDetails?._id}
                      </li>
                      <li>
                        <span>{t("pageProductDetails.type")}:</span>{" "}
                        {productDetails?.type}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailsContent;
