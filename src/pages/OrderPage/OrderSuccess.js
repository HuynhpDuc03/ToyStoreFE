import React from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { orderContant } from "../../contant";
import { converPrice } from "../../utils";

const OrderSuccess = () => {
  const order = useSelector((state) => state.order);
  const location = useLocation();
  console.log("location", location)
  const {state} = location;
  return (
    <div>
      {/* <!-- Breadcrumb Section Begin --> */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Check Out</h4>
                <div className="breadcrumb__links">
                  <a href="/">Home</a>
                  <a href="/">Shop</a>
                  <span>Check Out</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Breadcrumb Section End --> */}

      {/* <!-- Checkout Section Begin --> */}
      <section className="checkout spad">
        <div className="container">
          <div className="checkout__form">
            <form action="/">
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <h6
                    style={{ textAlign: "center" }}
                    className="checkout__title"
                  >
                    thanh toán sản phẩm
                  </h6>

                  <div style={{ marginBottom: "24px" }}>
                    <h6
                      className="coupon__code"
                      style={{ marginBottom: "24px" }}
                    >
                      <span className="icon_gift_alt"></span>Phương thức
                      giao hàng
                    </h6>
                    <div className="checkout__input__checkbox">
                      <label
                        for="fast"
                        style={{
                          backgroundColor: "rgb(188 235 255)",
                          display: "inline-block",
                          borderRadius: "8px",
                          padding: "16px",
                          border: "1px solid rgb(0 179 255)",
                          cursor:"default"
                        }}
                      >
                        <span style={{ fontWeight: 700, color: "#ff7b02" }}>
                          {orderContant.delivery[state?.deliveryMethod]}
                        </span>{" "}
                        Giao hàng tiết kiệm
                      </label>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <h6
                      className="coupon__code"
                      style={{ marginBottom: "24px" }}
                    >
                      <span className="icon_creditcard"></span>Phương thức
                      thanh toán
                    </h6>
                    <div className="checkout__input__checkbox">
                      <label
                        for="paymentincash"
                        style={{
                          backgroundColor: "rgb(188 235 255)",
                          display: "inline-block",
                          borderRadius: "8px",
                          padding: "16px",
                          border: "1px solid rgb(0 179 255)",
                          cursor:"default"
                        }}
                      >
                       {orderContant.payment[state?.payment]}
                      </label>
                    </div>
                  </div>
                </div>
              </div>


              <div className="row">
                <div className="col-lg-12 col-md-12">
                <div className="shopping__cart__table">
                <table>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.orders?.map((order) => {
                      return (
                        <tr>
                          <td className="product__cart__item">
                            <div className="product__cart__item__pic">
                              <img
                                width={100}
                                height={100}
                                src={
                                  order?.image[0]}
                                alt=""
                              />
                            </div>
                            <div className="product__cart__item__text">
                              <h6
                                style={{
                                  whiteSpace: "nowrap",
                                  textOverflow: "ellipsis",
                                  overflow: "hidden",
                                }}
                              >
                                {order?.name}
                              </h6>
                            </div>
                          </td>
                          <td className="quantity__item">
                            <div className="quantity">
                              <div className="pro-qty-2">
                                  {order?.amount}
                              </div>
                            </div>
                          </td>
                          <td className="cart__price">
                          {converPrice(order?.price)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
                </div>
              </div>
              

              <div className="row">
                <div className="col-md-6">
                <div className="continue__btn">
                    <Link to={"/products"}>Continue Shopping</Link>
                  </div>
                </div>
                <div className="col-md-6">
                    <span style={{float: "right", color:"green", width:"50%",fontSize:"18px",border:"1px solid", borderRadius:"5px", textAlign:"center", padding:"8px 0" }}>Tổng tiền: {converPrice(state?.totalPriceMemo)}</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* <!-- Checkout Section End --> */}
    </div>
  );
};

export default OrderSuccess;
