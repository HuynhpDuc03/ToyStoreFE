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

import { Button, Checkbox, message } from "antd";
import StepComponent from "../../components/StepComponent/StepComponent";
import VnProvinces from "vn-local-plus";
import { useTranslation } from "react-i18next";

const OrderPage = () => {
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [listChecked, setListChecked] = useState([]);
  console.log(user);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const navigate = useNavigate();
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
          const districtData = VnProvinces.getDistrictsByProvinceCode(
            user.city
          );
          const userDistrict = districtData.find(
            (dist) => dist.code === user.district
          );
          setDistrict(userDistrict?.name || "");
        }

        if (user.district) {
          const wardData = VnProvinces.getWardsByDistrictCode(user.district);
          const userWard = wardData.find((ward) => ward.code === user.ward);
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
    const totalPrice = priceMemo - priceDiscountMemo;
    return isNaN(Number(totalPrice)) ? 0 : Number(totalPrice);
  }, [priceMemo, priceDiscountMemo]);

  const itemsDiscount = [
    {
      title: t("pageCart.Discount")+" 100.000 Đ",
      description: t("pageCart.DiscountDescription")+" 1.000.000 Đ",
    },
    {
      title: t("pageCart.Discount")+" 250.000 Đ",
      description: t("pageCart.DiscountDescription")+" 2.000.000 Đ",
    },
    {
      title: t("pageCart.Discount")+" 350.000 Đ",
      description: t("pageCart.DiscountDescription")+" 3.000.000 Đ",
    },
  ];

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>{t("pageCart.cart")}</h4>
                <div className="breadcrumb__links">
                  <a href="/">{t("header.home")}</a>
                  <a href="/products">{t("header.shop")}</a>
                  <span>{t("pageCart.cart")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="shopping-cart spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
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
                         {t("pageCart.product")}
                        </Checkbox>
                      </th>
                      <th>{t("pageCart.quantity")}</th>
                      <th>{t("pageCart.total")}</th>
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
                           {t('pageCart.emtpy')}
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
                                  src={order?.image[0]}
                                  alt=""
                                />
                              </div>
                              <div className="product__cart__item__text">
                                <h6 className="multi-line-ellipsis">
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
                    <Link to={"/products"}>{t("pageCart.continueShopping")}</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 mt-3">
              {user?.address ? (
                <div className="cart__discount">
                  <h6>
                    {t("pageCart.address")}
                    <Button
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                      onClick={()=> navigate("/profile-user")}
                      type="link"
                    >
                      {t("pageCart.change")}
                    </Button>
                  </h6>
                  <div
                    style={{ textTransform: "capitalize", fontSize: "16px" }}
                  >
                    {t("pageCart.Receiver")} {user?.name}
                  </div>
                  <div>{user?.address}</div>
                  <div>
                    {ward}, {district}, {province}
                  </div>
                </div>
              ) : (
                <div className="cart__discount">
                  <h6>
                    {t("pageCart.address")}
                    <Button
                      style={{
                        fontSize: "15px",
                        fontWeight: 500,
                      }}
                      onClick={()=> navigate("/profile-user")}
                      type="link"
                    >
                      {t("pageCart.change")}
                    </Button>
                  </h6>
                  <div>
                    <h5>Chưa có Thông tin địa chỉ</h5>
                  </div>
                </div>
              )}
              <CheckOut
                provisional={priceMemo}
                discount={priceDiscountMemo}
                total={totalPriceMemo}
                checkAddress={(user?.address === undefined || user.address === "") && 
                    (user?.city === undefined || user.city === "") && (user?.district === undefined || user.district === "") &&
                    (user?.ward === undefined || user.ward === "") && (user?.phone === undefined || user.phone === "")}
                
                disabled={order?.orderItemsSelected?.length === 0}
                isLoggedIn={!!user?.id}
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
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState("home");
  const { provisional, total, discount, disabled, isLoggedIn,checkAddress } = props;
  const navigate = useNavigate();

  const handleClick = (item) => {
    setActiveItem(item);
  };

  const handleClickCheckOut = () => {
    if (!isLoggedIn) {
      message.info(t("pageCart.noLogin"));
    } else if (disabled) {
      message.info(t("pageCart.noSelected"));
    } 
    // else if (!checkAddress){
    //   message.info("Thông tin địa chỉ chưa có hoặc thiếu, Vui lòng kiểm tra lại!");
    // }
     else {
      navigate(`/Checkout`);
    }
  };

  return (
    <div className="cart__total">
      <h6>{t("pageCart.cartTotal")}</h6>
      <ul>
        <li>
          {t("pageCart.temporary")}<span>{converPrice(provisional)}</span>
        </li>
        <li>
        {t("pageCart.Discount")} <span>{converPrice(discount)}</span>
        </li>
        <li>
        {t("pageCart.totalPrice")} <span>{converPrice(total)}</span>
        </li>
      </ul>
      <div className={activeItem === "shop" ? "active" : ""}>
        <NavLink
          activeClassName="active"
          className={`primary-btn ${disabled ? "disabled" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            handleClick("shop");
            handleClickCheckOut();
          }}
        >
          {t("pageCart.checkout")}
        </NavLink>
      </div>
    </div>
  );
};
