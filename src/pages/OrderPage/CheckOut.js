import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { converPrice } from "../../utils";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as OrderService from "../../services/OrderService";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { removeAllOrderProduct } from "../../redux/slides/orderSlide";
import VnProvinces from 'vn-local-plus';

const CheckOut = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payment, setPayment] = useState("");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const handleCheckboxChange = (e) => {
    setPayment(e.target.id);
  };
  const [deliveryMethod, setDeliveryMethod] = useState("");

  const handleDeliveryCheckboxChange = (e) => {
    setDeliveryMethod(e.target.id);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    if (priceMemo > 1000000 && priceMemo < 2000000) {
      return 100000;
    } else if (priceMemo > 2000000 && priceMemo < 3000000) {
      return 250000;
    } else if (priceMemo >= 3000000) {
      return 350000;
    } else {
      return 0;
    }
  }, [priceMemo]);

  const diliveryPriceMemo = useMemo(() => {
    if (isNaN(priceMemo)) return 0;
    if (deliveryMethod === "fast") {
      return priceMemo > 100000 ? 10000 : 20000;
    } else if (deliveryMethod === "gojek") {
      return 15000;
    }
    return 0;
  }, [priceMemo, deliveryMethod]);

  const totalPriceMemo = useMemo(() => {
    const totalPrice = priceMemo - priceDiscountMemo + diliveryPriceMemo;
    return isNaN(Number(totalPrice)) ? 0 : Number(totalPrice);
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const provinceData = VnProvinces.getProvinces();
        const userProvince = provinceData.find(
          (prov) => prov.code === user.city
        );
        setProvince(userProvince?.name || "");

        if (user.city) {
          const districtData = VnProvinces.getDistrictsByProvinceCode(user.city);
          const userDistrict = districtData.find(
            (dist) => dist.code === user.district
          );
          setDistrict(userDistrict?.name || "");
        }

        if (user.district) {
          const wardData = VnProvinces.getWardsByDistrictCode(user.district);
          const userWard = wardData.find(
            (ward) => ward.code === user.ward
          );
          setWard(userWard?.name || "");
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, [user.city, user.district, user.ward]);


  const handleAddOrder = () => {
    if (
      (!user?.access_token &&
        order &&
        user?.name &&
        user?.address &&
        user?.phone &&
        user?.city,
      priceMemo && user?.id)
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        city: user?.city,
        district: user?.district,
        ward: user?.ward,
        phone: user?.phone,
        user: user?.id,
        paymentMethod: payment,
        itemsPrice: priceMemo,
        shippingPrice: diliveryPriceMemo,
        totalPrice: totalPriceMemo,
      });
    }
  };

  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });

  const { data: dataAdd, isSuccess, isError } = mutationAddOrder;

  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrdered = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrdered.push(element.product);
      });

      dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
      message.success("Đặt hàng thành công");
      navigate("/OrderSuccess", {
        state: {
          deliveryMethod,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo,
        },
      });
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

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
                <div className="col-lg-8 col-md-6">
                  <h6 className="checkout__title">thanh toán sản phẩm</h6>

                  <div style={{ marginBottom: "24px" }}>
                    <h6
                      className="coupon__code"
                      style={{ marginBottom: "24px" }}
                    >
                      <span className="icon_gift_alt"></span>Chọn phương thức
                      giao hàng
                    </h6>
                    <div className="checkout__input__checkbox">
                      <label for="fast">
                        <span style={{ fontWeight: 700, color: "#ff7b02" }}>
                          FAST
                        </span>{" "}
                        Giao hàng tiết kiệm
                        <input
                          onChange={handleDeliveryCheckboxChange}
                          checked={deliveryMethod === "fast"}
                          type="checkbox"
                          id="fast"
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>

                    <div className="checkout__input__checkbox">
                      <label for="gojek">
                        <span style={{ fontWeight: 700, color: "#ff7b02" }}>
                          GO JEK
                        </span>{" "}
                        Giao hàng tiết kiệm
                        <input
                          onChange={handleDeliveryCheckboxChange}
                          checked={deliveryMethod === "gojek"}
                          type="checkbox"
                          id="gojek"
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                  </div>

                  <div style={{ marginBottom: "24px" }}>
                    <h6
                      className="coupon__code"
                      style={{ marginBottom: "24px" }}
                    >
                      <span className="icon_creditcard"></span>Chọn phương thức
                      thanh toán
                    </h6>
                    <div className="checkout__input__checkbox">
                      <label for="paymentincash">
                        Thanh toán bằng tiền mặt
                        <input
                          onChange={handleCheckboxChange}
                          checked={payment === "paymentincash"}
                          
                          type="checkbox"
                          id="paymentincash"
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>

                    {/* <div className="checkout__input__checkbox">
                      <label for="momo">
                        Momo
                        <input
                          onChange={handleCheckboxChange}
                          checked={payment === "momo"}
                          type="checkbox"
                          id="momo"
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="checkout__input__checkbox">
                      <label for="zalopay">
                        Zalo Pay
                        <input
                          onChange={handleCheckboxChange}
                          checked={payment === "zalopay"}
                          type="checkbox"
                          id="zalopay"
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div> */}
                  </div>
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="checkout__order">
                    <h4 className="order__title">Đơn hàng của bạn</h4>
                    <div className="checkout__order__products">
                      Sản phẩm <span>Tổng tiền</span>
                    </div>
                    <ul className="checkout__total__products">
                      {order?.orderItemsSelected?.map((order) => {
                        return (
                          <li>
                            <span
                              className="checkout__total__products-name"
                              style={{
                                whiteSpace: "nowrap",
                              }}
                            >
                              {" "}
                              01. {order?.name}
                            </span>

                            <span className="checkout__total__products-price">
                              {converPrice(order?.price)}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <ul className="checkout__total__all">
                      <li>
                        Tạm tính <span>{converPrice(priceMemo)}</span>
                      </li>
                      <li>
                        Giảm giá <span>{converPrice(priceDiscountMemo)}</span>
                      </li>
                      <li>
                        Phí vận chuyển{" "}
                        <span>{converPrice(diliveryPriceMemo)}</span>
                      </li>
                      <li>
                        Thành tiền <span>{converPrice(totalPriceMemo)}</span>
                      </li>
                    </ul>
            
                    <p>{`Địa chỉ:  ${user?.address}, ${ward}, ${district}, ${province}`}</p>
                   
                    <button
                      type="button"
                      onClick={() => handleAddOrder()}
                      className="site-btn"
                    >
                      ĐẶT HÀNG
                    </button>
                  </div>
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

export default CheckOut;
