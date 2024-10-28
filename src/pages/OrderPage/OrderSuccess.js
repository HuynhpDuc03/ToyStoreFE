import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { Contant } from "../../contant";
import { converPrice } from "../../utils";
import { useTranslation } from "react-i18next";
import { EnvironmentTwoTone, InfoCircleTwoTone } from "@ant-design/icons";
import VnProvinces from "vn-local-plus";

const OrderSuccess = () => {
  const { t } = useTranslation();
  const orderContant = Contant(t);
  const order = useSelector((state) => state.order);
  const location = useLocation();
  const {state} = location;
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const provinceData = VnProvinces.getProvinces();
        const userProvince = provinceData.find(
          (prov) => prov.code === state.city
        );
        setProvince(userProvince?.name || "");

        if (state.city) {
          const districtData = VnProvinces.getDistrictsByProvinceCode(
            state.city
          );
          const userDistrict = districtData.find(
            (dist) => dist.code === state.district
          );
          setDistrict(userDistrict?.name || "");
        }

        if (state.district) {
          const wardData = VnProvinces.getWardsByDistrictCode(state.district);
          const userWard = wardData.find((ward) => ward.code === state.ward);
          setWard(userWard?.name || "");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, [state.city, state.district, state.ward]);
  console.log("state",state)

  return (
    <div>
      {/* <!-- Breadcrumb Section Begin --> */}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
              <h4>{t("pageCheckOut.checkout")}</h4>
                <div className="breadcrumb__links">
                <a href="/">{t("header.home")}</a>
                <a href="/products">{t("header.shop")}</a>
                  <span>{t("pageCheckOut.checkout")}</span>
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
              <h4
                    style={{ textAlign: "center" }}
                    className="checkout__title"
                  >
                    {t("pageCheckOut.productPayment")}
                  </h4>
                <div className="col-lg-6 col-md-6">
                <div style={{ marginBottom: "24px" }}>
                    <h5
                      className="coupon__code"
                      style={{ marginBottom: "24px", borderTop:"2px solid #189eff" }}
                    >
                      <InfoCircleTwoTone />{t("pageOrderSuccess.infoUser")} 
                    </h5>
                    <div className="checkout__input__checkbox" style={{paddingLeft:"10px"}}>
                     

                       <span style={{textTransform:"capitalize"}}>Họ tên: {state.fullName}</span> <br/>
                       <span>Số điện thoại: {state.phone}</span> <br/>
                       <span>Email: {state.email}</span> <br/>
                  
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <h5
                      className="coupon__code"
                      style={{ marginBottom: "24px", borderTop:"2px solid #189eff" }}
                    >
                      <EnvironmentTwoTone />{t("pageOrderSuccess.infoAddress")}
                    </h5>
                    <div className="checkout__input__checkbox" style={{paddingLeft:"10px"}}>
                     
                       <span>

                      {`${t("pageCheckOut.address")}:  ${state?.address}, ${ward}, ${district}, ${province}`}
                       </span>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-6">
                 

                  <div style={{ marginBottom: "24px" }}>
                    <h5
                      className="coupon__code"
                      style={{ marginBottom: "24px" }}
                    >
                      <span className="icon_gift_alt"></span>{t("pageOrderSuccess.deliveryMethod")}
                    </h5>
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
                    <h5
                      className="coupon__code"
                      style={{ marginBottom: "24px" }}
                    >
                      <span className="icon_creditcard"></span>{t("pageOrderSuccess.paymentMethod")}
                    </h5>
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
                      <th>{t("pageCart.product")}</th>
                      <th>{t("pageCart.quantity")}</th>
                      <th>{t("pageCart.price")}</th>
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
                    <Link to={"/products"}>{t("pageOrderSuccess.buttonContinueShopping")}</Link>
                  </div>
                </div>
                <div className="col-md-6">
                    <span style={{float: "right", color:"green", width:"50%",fontSize:"18px",border:"1px solid", borderRadius:"5px", textAlign:"center", padding:"8px 0" }}>{t("pageOrderSuccess.orderTotal")}: {converPrice(state?.totalPriceMemo)}</span>
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
