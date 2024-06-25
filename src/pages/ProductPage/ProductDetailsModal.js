import React, { useEffect, useState } from "react";
import { Image, InputNumber, Rate, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { converPrice } from "../../utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as ProductService from "../../services/ProductService";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";


const ProductDetailsContent = ({id}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);
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
    console.log("value", value);
    setNumProduct(Number(value));
  };
  const fetchGetDetailsProduct = async () => {
    const res = await ProductService.getDetailsProduct(id);
    return res?.data;
  };
  const { isLoading, isError,data: productDetails } = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchGetDetailsProduct
  });

  console.log("details",productDetails)

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
        console.log(orderRedux?.amount)
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
        message.error("Có lỗi khi thêm vào giỏ hàng", 1.5);
      }
    }
  };

  const discountedPrice =
    productDetails?.price * (1 - productDetails?.discount / 100);
   
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
            <img
              width={546}
              height={546}
              src={require(`../../img/product/${productDetails?.image}`)}
            />
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
              |<span> {formatSelled(productDetails?.selled)} Đã Bán</span>
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
                Siêu chiến giáp của Cole có buồng lái và được trang bị một cây
                búa để chiến đấu với những tên Chiến binh Sói gian ác. Và bây
                giờ, bạn có thể kết hợp các bộ phận của 3 cỗ máy ninja tuyệt vời
                do Cole, Sora và Kai điều khiển để tạo ra cỗ máy kết hợp của
                riêng bạn.
              </p>
              <div className="product__details__cart__option">
                <>
                  <span>Số lượng </span>
                  <InputNumber
                    style={{ marginRight: "10px" }}
                    min={1}
                    max={productDetails?.countInStock}
                    defaultValue={1}
                    value={numProduct}
                    onChange={onChange}
                  />
                  <span>{productDetails?.countInStock} sản phẩm có sẵn</span>
                </>
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
                    <span>Mã sản phẩm:</span> {productDetails?.id}
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
  )}
  </>
  );
};

export default ProductDetailsContent;
