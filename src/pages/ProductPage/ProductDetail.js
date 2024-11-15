import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { Button, Image, InputNumber, Rate, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import favoriteSlide, {
  addFavoriteProduct,
  removeFavoriteProduct,
} from "../../redux/slides/favoriteSlide";
import { converPrice, formatDateBlog, initFacebookSDK } from "../../utils";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import ProductImagesSlider from "../../components/ProductImageSliderCompoent/ProductImagesSlider";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import ButtonFavouriteComponent from "../../components/ButtonFavouriteComponent/ButtonFavouriteComponent";
import { ShoppingCartOutlined } from "@ant-design/icons";
import LikeButtonComponent from "../../components/LikeButtonComponent/LikeButtonComponent";
import CommentComponent from "../../components/CommentComponent/CommentComponent";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import { vi, en } from "date-fns/locale";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state.user);

  const order = useSelector((state) => state.order);
  const favoriteItems = useSelector((state) => state.favorite.favoriteItems);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const onChange = (value) => {
    setNumProduct(Number(value));
  };
  useEffect(() => {
    const redirectURL = localStorage.getItem("redirectURL");
    if (redirectURL) {
      localStorage.removeItem("redirectURL");
      navigate(redirectURL);
    }
  }, []);

  const fetchGetDetailsProduct = async () => {
    const res = await ProductService.getDetailsProduct(id);
    return { product: res.data.product, rating: res.data.ratings };
  };
  const { isLoading, data } = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchGetDetailsProduct,
    enabled: !!id,
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
        message.success(t("pageProductDetails.removeFavorite"), 1.5);
      } else {
        dispatch(
          addFavoriteProduct({
            favoriteItem: {
              name: productDetails?.name,
              image: productDetails?.image[0],
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

  const formatSelled = (selled) => {
    if (selled > 1000) {
      const formattedNumber = (selled / 1000).toFixed(1);
      return `${formattedNumber}k`;
    } else {
      return selled;
    }
  };

  const [favourite, setFavourite] = useState(false);

  useEffect(() => {
    initFacebookSDK();
  }, []);

  return (
    <LoadingComponent isLoading={isLoading}>
      {/* <!-- Shop Details Section Begin --> */}
      <section className="shop-details">
        <div className="product__details__pic">
          <div
            className="container pt-3 pb-3"
            style={{ backgroundColor: "#fff", borderRadius: "5px" }}
          >
            <div className="row">
              <div className="col-lg-4"></div>
              <div className="col-lg-8">
                <div className="product__details__breadcrumb">
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/");
                    }}
                  >
                    {t("header.home")}
                  </Link>
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/products");
                    }}
                  >
                    {t("header.shop")}
                  </Link>
                  <span> {t("header.productDetail")}</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-4">
                <div className="tab-content">
                  <div className="tab-pane active" id="tabs-1" role="tabpanel">
                    <div className="product__details__pic__item">
                      <ProductImagesSlider images={productDetails?.image} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-8">
                <div className="product__details__content">
                  <div className="container">
                    <div className="row d-flex justify-content-center">
                      <div className="col-lg-8">
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
                            {t("pageProductDetails.selled")}{" "}
                          </span>
                          |
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
                            Siêu chiến giáp của Cole có buồng lái và được trang
                            bị một cây búa để chiến đấu với những tên Chiến binh
                            Sói gian ác. Và bây giờ, bạn có thể kết hợp các bộ
                            phận của 3 cỗ máy ninja tuyệt vời do Cole, Sora và
                            Kai điều khiển để tạo ra cỗ máy kết hợp của riêng
                            bạn.
                          </p>
                          <LikeButtonComponent
                            dataHref={
                              "https://developers.facebook.com/docs/plugins/"
                            }
                          />
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
                                <div className="col-md-5">
                                  <ButtonComponent
                                    style={{ height: "48px", width: "100%" }}
                                  >
                                    MUA NGAY
                                  </ButtonComponent>
                                </div>
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
                                <span>
                                  {t("pageProductDetails.idProduct")}:
                                </span>{" "}
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
              </div>
            </div>
          </div>
        </div>
        <div className="product__details__content">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div
                  className="product__details__tab"
                  style={{ paddingTop: "0px", paddingBottom: "50px" }}
                >
                  <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        data-toggle="tab"
                        href="#tabs-5"
                        role="tab"
                      >
                        {t("pageProductDetails.description")}
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#tabs-6"
                        role="tab"
                      >
                        {t("pageProductDetails.customerPreviews")}(
                        {productRating?.length})
                      </a>
                    </li>
                  </ul>
                  <div className="tab-content">
                    <div
                      className="tab-pane active"
                      id="tabs-5"
                      role="tabpanel"
                    >
                      <div className="product__details__tab__content">
                        <p className="note">
                          Nam tempus turpis at metus scelerisque placerat nulla
                          deumantos solicitud felis. Pellentesque diam dolor,
                          elementum etos lobortis des mollis ut risus. Sedcus
                          faucibus an sullamcorper mattis drostique des commodo
                          pharetras loremos.
                        </p>
                        <div className="product__details__tab__content__item">
                          <h5>Products Infomation</h5>
                          <p>
                            A Pocket PC is a handheld computer, which features
                            many of the same capabilities as a modern PC. These
                            handy little devices allow individuals to retrieve
                            and store e-mail messages, create a contact file,
                            coordinate appointments, surf the internet, exchange
                            text messages and more. Every product that is
                            labeled as a Pocket PC must be accompanied with
                            specific software to operate the unit and must
                            feature a touchscreen and touchpad.
                          </p>
                          <p>
                            As is the case with any new technology product, the
                            cost of a Pocket PC was substantial during it’s
                            early release. For approximately $700.00, consumers
                            could purchase one of top-of-the-line Pocket PCs in
                            2003. These days, customers are finding that prices
                            have become much more reasonable now that the
                            newness is wearing off. For approximately $350.00, a
                            new Pocket PC can now be purchased.
                          </p>
                        </div>
                        <div className="product__details__tab__content__item">
                          <h5>Material used</h5>
                          <p>
                            Polyester is deemed lower quality due to its none
                            natural quality’s. Made from synthetic materials,
                            not natural like wool. Polyester suits become
                            creased easily and are known for not being
                            breathable. Polyester suits tend to have a shine to
                            them compared to wool and cotton suits, this can
                            make the suit look cheap. The texture of velvet is
                            luxurious and breathable. Velvet is a great choice
                            for dinner party jacket and can be worn all year
                            round.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane" id="tabs-6" role="tabpanel">
                      <div className="product__details__tab__content">
                        <div className="product__details__tab__content__item">
                          <h5
                            style={{
                              borderBottom: "1px solid rgba(0, 0, 0, .09)",
                              paddingBottom: "12px",
                            }}
                          >
                            Đánh giá
                          </h5>

                          {productRating?.map((product) => {
                            return (
                              <div
                                key={product?._id}
                                style={{
                                  borderBottom: "1px solid rgba(0, 0, 0, .09)",
                                  padding: "12px 0px",
                                }}
                              >
                                <p>
                                  {product?.user.name} -{" "}
                                  {formatDistanceToNow(
                                    new Date(product?.createdAt),
                                    {
                                      addSuffix: true,
                                      locale: vi,
                                    }
                                  )}
                                </p>

                                <p>
                                  {" "}
                                  <Rate
                                    disabled
                                    value={product?.rating}
                                    style={{ fontSize: "16px" }}
                                  />{" "}
                                  {product?.comment}
                                </p>
                                <Image alt="hinh danh gia san pham" width={72} src={product?.image}/>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <CommentComponent
                dataHref={
                  "https://developers.facebook.com/docs/plugins/comments#configurator"
                }
                width="1140"
              />
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Shop Details Section End --> */}
    </LoadingComponent>
  );
};

export default ProductDetail;
