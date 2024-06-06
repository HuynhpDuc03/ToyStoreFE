import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  decreaseAmount,
  increaseAmount,
  removeOrderProduct,
  selectedOrder,
} from "../../redux/slides/orderSlide";
import { converPrice } from "../../utils";
import "./orderpage.css";
import * as UserService from "../../../src/services/UserService";
import { Checkbox } from "antd";
import StepComponent from "../../components/StepComponent/StepComponent";
import VnProvinces from 'vn-local-plus';

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [listChecked, setListChecked] = useState([]);

  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

 

  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };

  const handleOnchangeCheckAll = (e) => {
    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };

  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);

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

  const handleDeleteOrder = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  const handleChangeAmount = (type, idProduct, limited) => {
    if (type === "increase") {
      if (!limited) {
        dispatch(increaseAmount({ idProduct }));
      }
    } else {
      if (!limited) {
        dispatch(decreaseAmount({ idProduct }));
      }
    }
  };

  const totalProduct = (price, amount) => price * amount;

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

  const totalPriceMemo = useMemo(() => {
    const totalPrice = priceMemo - priceDiscountMemo 
    return isNaN(Number(totalPrice)) ? 0 : Number(totalPrice);
  }, [priceMemo, priceDiscountMemo]);

  const itemsDiscount = [
    {
      title: "Giảm 100.000 Đ",
      description: "Khi mua hàng trên 1.000.000 Đ",
    },
    {
      title: "Giảm 250.000 Đ",
      description: "Khi mua hàng trên 2.000.000 Đ",
    },
    {
      title: "Giảm 350.000 Đ",
      description: "Khi mua hàng trên 3.000.000 Đ",
    },
  ];

  return (
    <div>
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Shopping Cart</h4>
                <div className="breadcrumb__links">
                  <a href="/">Home</a>
                  <a href="/products">Shop</a>
                  <span>Shopping Cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shopping-cart spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <StepComponent
                items={itemsDiscount}
                curent={
                  priceDiscountMemo === 350000
                    ? 3
                    : priceDiscountMemo === 250000
                    ? 2
                    : priceDiscountMemo === 100000
                    ? 1
                    : priceDiscountMemo === 0
                    ? 0 
                    : order?.orderItemsSelected?.length === 0
                    ? 0
                    : 3
                }
              />
            </div>
            <div className="col-lg-8 mt-3">
              <div className="shopping__cart__table">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <Checkbox
                          onChange={handleOnchangeCheckAll}
                          checked={
                            listChecked?.length === order?.orderItems?.length
                          }
                        >
                          Sản phẩm
                        </Checkbox>
                      </th>
                      <th>Số lượng</th>
                      <th>Tổng cộng</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.length === 0 ? (
                      <tr className="product__cart__item">
                        <td className="product__cart__item" colSpan={3}>
                          <h6
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Không có sản phẩm trong giỏ hàng
                          </h6>
                        </td>
                      </tr>
                    ) : (
                      order?.orderItems?.map((order) => {
                        return (
                          <tr>
                            <td className="product__cart__item">
                              <div className="product__cart__item__pic">
                                <Checkbox
                                  className="mr-3"
                                  onChange={onChange}
                                  value={order?.product}
                                  checked={listChecked.includes(order?.product)}
                                />
                                <img
                                  width={100}
                                  height={100}
                                  src={require("../../img/product/" +
                                    order?.image)}
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
                                <h5>{converPrice(order?.price)}</h5>
                              </div>
                            </td>
                            <td className="quantity__item">
                              <div className="quantity">
                                <div className="pro-qty-2">
                                  <span
                                    className="dec qtybtn"
                                    style={{}}
                                    onClick={() =>
                                      handleChangeAmount(
                                        "decrease",
                                        order?.product,
                                        order?.amount === 1
                                      )
                                    }
                                  >
                                    {"<"}
                                  </span>
                                  <input
                                    type="number"
                                    min={1}
                                    max={order?.countInstock}
                                    defaultValue={order?.amount}
                                    value={order?.amount}
                                    inputMode="numeric"
                                    style={{ "-moz-appearance": "textfield" }}
                                  />

                                  <span
                                    className="inc qtybtn"
                                    onClick={() =>
                                      handleChangeAmount(
                                        "increase",
                                        order?.product,
                                        order?.amount === order?.countInstock
                                      )
                                    }
                                  >
                                    {">"}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="cart__price">
                              {converPrice(
                                totalProduct(order?.price, order?.amount)
                              )}
                            </td>
                            <td
                              className="cart__close"
                              style={{ cursor: "pointer" }}
                            >
                              <i
                                className="fa fa-close"
                                onClick={() =>
                                  handleDeleteOrder(order?.product)
                                }
                              ></i>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-6 col-sm-6 ">
                  <div className="continue__btn">
                    <Link to={"/products"}>Continue Shopping</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-3">
              {user?.address ? (
                <div className="cart__discount">
                  <h6>Địa chỉ giao hàng</h6>

                  <div>{`${user?.address}, ${ward}, ${district}, ${province}`}</div>
                </div>
              ) : (
                <div></div>
              )}
              <CheckOut
                provisional={priceMemo}
                discount={priceDiscountMemo}
                total={totalPriceMemo}
                disabled={order?.orderItemsSelected?.length === 0}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OrderPage;

const CheckOut = (props) => {
  const [activeItem, setActiveItem] = useState("home");
  const { provisional, total, discount, disabled } = props;
  const navigate = useNavigate();

  const handleClick = (item) => {
    setActiveItem(item);
  };
  const handleClickCheckOut = () => {
    navigate(`/Checkout`);
  };
  return (
    <div className="cart__total">
      <h6>Cart total</h6>
      <ul>
        <li>
          Tạm tính <span>{converPrice(provisional)}</span>
        </li>
        <li>
          Giảm giá <span>{converPrice(discount)}</span>
        </li>
        <li>
          Tổng tiền <span>{converPrice(total)}</span>
        </li>
      </ul>
      <div className={activeItem === "shop" ? "active" : ""}>
        <NavLink
          activeClassName="active"
          className={`primary-btn ${disabled ? "disabled" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            handleClick("shop");
            if (!disabled) {
              handleClickCheckOut();
            }
          }}
        >
          Proceed to checkout
        </NavLink>
      </div>
    </div>
  );
};