import { Button, FloatButton, Input, Popover } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../../src/services/UserService";

import { resetUser } from "../../redux/userSlide";
import {
  HeartOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { useDebounce } from "../../hooks/useDebounce";
import { converPrice } from "../../utils";
import SearchComponent from "../SearchComponent/SearchComponent";

const HearderComponent = () => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState("home");
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveItem("home");
    } else if (
      path.startsWith("/products") ||
      path.startsWith("/productsDetail")
    ) {
      setActiveItem("shop");
    } else if (path.startsWith("/blogs") || path.startsWith("/blogDetails")) {
      setActiveItem("blog");
    } else if (path.startsWith("/contact")) {
      setActiveItem("contact");
    } else {
      setActiveItem("");
    }
  }, [location.pathname]);

  const handleClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div>
      <FloatButton.BackTop duration={100} />
      <header className="header">
        <div className="header__top">
          <Header />
        </div>
        <div className="container">
          <Menu />
          <div className="canvas__open">
            <i className="fa fa-bars"></i>
          </div>
        </div>
        <div className="header__bottom">
          <div className="container">
            <div className="row">
              <div className="col-lg-12 col-md-12">
                <nav className="header__menu mobile-menu">
                  <ul>
                    <li className={activeItem === "home" ? "active" : ""}>
                      <NavLink
                        exact
                        to="/"
                        activeClassName="active"
                        onClick={() => handleClick("home")}
                      >
                        {t("header.home")}
                      </NavLink>
                    </li>
                    <li className={activeItem === "shop" ? "active" : ""}>
                      <NavLink
                        to="/products"
                        activeClassName="active"
                        onClick={() => handleClick("shop")}
                      >
                        {t("header.shop")}
                      </NavLink>
                    </li>
                    <li className={activeItem === "blog" ? "active" : ""}>
                      <NavLink
                        to="/blogs"
                        activeClassName="active"
                        onClick={() => handleClick("blog")}
                      >
                        {t("header.blog")}
                      </NavLink>
                    </li>
                    <li className={activeItem === "contact" ? "active" : ""}>
                      <NavLink
                        to="/contact"
                        activeClassName="active"
                        onClick={() => handleClick("contact")}
                      >
                        {t("header.contact")}
                      </NavLink>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default HearderComponent;

const Menu = () => {

  const [activeItem, setActiveItem] = useState("home");
  const order = useSelector((state) => state.order.orderItems);
  const location = useLocation();


  useEffect(() => {
    if (
      location.pathname === "/products" ||
      location.pathname.startsWith("/products/") ||
      location.pathname.startsWith("/productsDetail/")
    ) {
      setActiveItem("shop");
    }
  }, [location.pathname]);

  const handleClick = (item) => {
    setActiveItem(item);
  };

 
  return (
    <div className="row">
      <div className="col-lg-2 col-md-2">
        <div className="header__logo">
          <Link to="/">
            <img width={150} height={53} src={require("../../img/logo.webp")} />
          </Link>
        </div>
      </div>
      <div className="col-lg-6 col-md-6" style={{ position: 'relative' }} >
      <SearchComponent></SearchComponent>
    </div>
      <div className="col-lg-4 col-md-4">
        <div className="row">
          <div className="col-lg-8 col-md-8" style={{ padding: "30px 0px" }}>
            <span>
              <a
                rel="nofollow"
                href="tel:1900 6750"
                title="Hotline"
                className="tracking-order"
              >
                Hotline: 1900 6750
              </a>
              <br />
              <a
                rel="nofollow"
                href="mailto:support@sapo.vn"
                title="Email"
                className="tracking-order index-mails"
              >
                Email: support@sapo.vn
              </a>
            </span>
          </div>
          <div className="col-lg-4 col-md-4">
            <div className="header__nav__option">
              <div className={activeItem === "shop" ? "active" : ""}>
                <NavLink
                  to="/productFavorite"
                  activeClassName="active"
                  onClick={() => handleClick("shop")}
                >
                  <HeartOutlined style={{ color: "#fff", fontSize: "24px" }} />
                </NavLink>
                <NavLink
                  to="/Order"
                  activeClassName="active"
                  onClick={() => handleClick("shop")}
                >
                  <ShoppingCartOutlined
                    style={{ color: "#fff", fontSize: "24px" }}
                  />
                  <span className="number-cart">{order.length}</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const handleLogout = async () => {
    await UserService.logoutUser();
    dispatch(resetUser());
    handleNavigatelogin();
  };

  useEffect(() => {
    setUserName(user?.name);
  }, [user.name]);

  const content = (
    <div className="user-menu">
      <p onClick={() => navigate("/profile-user")}> {t("header.myAccount")}</p>
      {user?.isAdmin && (
        <p onClick={() => navigate("/Dashboard")}> {t("header.Admin")}</p>
      )}
      <p onClick={handleLogout}> {t("header.signOut")}</p>
    </div>
  );
  const navigate = useNavigate();
  const handleNavigatelogin = () => {
    navigate("/SignIn");
  };
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-7">
          <div className="header__top__left">
            <p>{t("header.freeShipping")}</p>
          </div>
        </div>
        <div className="col-lg-6 col-md-5">
          <div className="header__top__right">
            {userName ? (
              <>
                <Popover content={content} trigger="hover">
                  <div className="header__top__links">
                    <span
                      style={{
                        color: "#ffff",
                        textTransform: "uppercase",
                        fontWeight: "700",
                        cursor: "pointer",
                        marginRight: "28px",
                      }}
                    >
                      {t("header.welcome")} {userName}
                    </span>
                  </div>
                </Popover>
              </>
            ) : (
              <div
                className="header__top__links"
                onClick={handleNavigatelogin}
                style={{ cursor: "pointer" }}
              >
                <span
                  style={{
                    color: "#ffff",
                    textTransform: "uppercase",
                    fontWeight: "700",
                    cursor: "pointer",
                    marginRight: "28px",
                  }}
                >
                  {t("header.signIn")}
                </span>
              </div>
            )}

            <div class="header__top__hover">
              <span>
                {i18n.language === "en" ? "EN" : "VN"}{" "}
                <i class="arrow_carrot-down"></i>
              </span>
              <ul>
                <li onClick={() => changeLanguage("en")}>EN</li>
                <li onClick={() => changeLanguage("vn")}>VN</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
