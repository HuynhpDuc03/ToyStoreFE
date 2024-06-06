import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { Image, InputNumber, Rate, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { converPrice } from "../../utils";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state.user);

  const order = useSelector((state) => state.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();

  const onChange = (value) => {
    console.log("value", value);
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
    return res.data;
  };
  const { data: productDetails } = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchGetDetailsProduct,
    enabled: !!id,
  });
  let imageUrl = productDetails?.image
    ? require(`../../img/product/${productDetails.image}`)
    : require(`../../img/product/product-1.jpg`);

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
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock,
            },
          })
        );
        message
          .open({
            type: "loading",
            content: "Loading...",
            duration: 0.75,
          })
          .then(() => message.success("Đã thêm vào giỏ hàng", 1.5));
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  const discountedPrice = productDetails?.price * (1 - productDetails?.discount / 100);

  const formatSelled = (selled) => {
    if (selled > 1000) {
      const formattedNumber = (selled / 1000).toFixed(1);
      return `${formattedNumber}k`;
    } else {
      return selled;
    }
  };
  
  return (
    <div>
      {/* <!-- Shop Details Section Begin --> */}
      <section className="shop-details">
        <div className="product__details__pic">
          <div className="container pt-3 pb-3" style={{ backgroundColor:"#fff",borderRadius:"5px"}}>
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
                    Home
                  </Link>
                  <Link
                    onClick={(e) => {
                      e.preventDefault();
                      navigate("/products");
                    }}
                  >
                    Shop
                  </Link>
                  <span>Product Details</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-4 col-md-4">
                <div className="tab-content">
                  <div className="tab-pane active" id="tabs-1" role="tabpanel">
                    <div className="product__details__pic__item">
                      <Image style={{width:"360px", height:"360px"}} src={imageUrl} />
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
                            {formatSelled(productDetails?.selled)} Đã Bán
                          </span>
                          <h3>
                            {converPrice(discountedPrice)}
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
                              {productDetails?.discount}% GIẢM
                            </span>
                          </h3>
                          <p>
                            Siêu chiến giáp của Cole có buồng lái và được trang
                            bị một cây búa để chiến đấu với những tên Chiến binh
                            Sói gian ác. Và bây giờ, bạn có thể kết hợp các bộ
                            phận của 3 cỗ máy ninja tuyệt vời do Cole, Sora và
                            Kai điều khiển để tạo ra cỗ máy kết hợp của riêng
                            bạn.
                          </p>
                          <div className="product__details__cart__option">
                            <span>Số lượng </span>
                            <InputNumber
                              style={{ marginRight: "10px" }}
                              min={1}
                              max={productDetails?.countInStock}
                              defaultValue={1}
                              value={numProduct}
                              onChange={onChange}
                            />
                            <span>
                              {productDetails?.countInStock} sản phẩm có sẵn
                            </span>
                            {errorLimitOrder && (
                              <div style={{ color: "red" }}>
                                Sản phẩm này đã hết hàng
                              </div>
                            )}
                          </div>
                          <button
                            onClick={handleAddOrderProduct}
                            className="primary-btn"
                            style={{ border: "none" }}
                          >
                            add to cart
                          </button>
                          <div className="product__details__last__option">
                            <ul>
                              <li>
                                <span>Mã sản phẩm:</span> {productDetails?._id}
                              </li>
                              <li>
                                <span>Thể loại:</span> {productDetails?.type}
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
                        Description
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#tabs-6"
                        role="tab"
                      >
                        Customer Previews(5)
                      </a>
                    </li>
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-toggle="tab"
                        href="#tabs-7"
                        role="tab"
                      >
                        Additional information
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
                    <div className="tab-pane" id="tabs-7" role="tabpanel">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Shop Details Section End --> */}
    </div>
  );
};

export default ProductDetail;
