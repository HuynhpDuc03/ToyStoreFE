import { FloatButton, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../../src/services/UserService";
import { resetUser } from "../../redux/userSlide";

const HearderComponent = () => {
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
      </header>
      {/* <!-- Search Begin --> */}
      <div className="search-model">
        <div className="h-100 d-flex align-items-center justify-content-center">
          <div className="search-close-switch">+</div>
          <form className="search-model-form">
            <input
              type="text"
              id="search-input"
              placeholder="Search here....."
            />
          </form>
        </div>
      </div>
      {/* <!-- Search End --> */}
    </div>
  );
};

export default HearderComponent;

const Menu = () => {
  const [activeItem, setActiveItem] = useState("home");
  const order = useSelector((state) => state.order.orderItems);
  const location = useLocation();
  useEffect(() => {
    // Kiểm tra đường dẫn và đặt activeItem tương ứng
    if (
      location.pathname === "/products" ||
      location.pathname.startsWith("/products/") ||
      location.pathname.startsWith("/productsDetail/")
    ) {
      setActiveItem("shop");
    }
  }, [location.pathname]); // Theo dõi thay đổi trong location.pathname
  const handleClick = (item) => {
    setActiveItem(item);
  };
  return (
    <div className="row">
      {/* style={{paddingBottom:0,paddingTop:"20px"}} */}
      <div className="col-lg-3 col-md-3">
        <div className="header__logo">
          <Link to="/">
            <p
              style={{
                fontSize: 25,
                textAlign: "center",
                fontWeight: "bold",
                marginBottom: "0px",
              }}
            >
              VÂN MỸ <span style={{ color: "#e50c50" }}>TOY STORE</span>
            </p>
          </Link>
        </div>
      </div>
      <div className="col-lg-6 col-md-6">
        <nav className="header__menu mobile-menu">
          <ul>
            <li className={activeItem === "home" ? "active" : ""}>
              <NavLink
                exact
                to="/"
                activeClassName="active"
                onClick={() => handleClick("home")}
              >
                Home
              </NavLink>
            </li>
            <li className={activeItem === "shop" ? "active" : ""}>
              <NavLink
                to="/products"
                activeClassName="active"
                onClick={() => handleClick("shop")}
              >
                Shop
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="col-lg-3 col-md-3">
        <div className="header__nav__option">
          <div className={activeItem === "shop" ? "active" : ""}>
            <NavLink
              to="/productFavorite"
              activeClassName="active"
              onClick={() => handleClick("shop")}
            >
              <img src={require("../../img/icon/heart.png")} alt="cart" />
            </NavLink>
            <NavLink
              to="/Order"
              activeClassName="active"
              onClick={() => handleClick("shop")}
            >
              <img src={require("../../img/icon/cart.png")} alt="cart" />
              <span>{order.length}</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const handleLogout = async () => {
    await UserService.logoutUser();
    dispatch(resetUser());
  };

  useEffect(() => {
    setUserName(user?.name);
  }, [user.name]);

  const content = (
    <div className="user-menu">
      <p onClick={() => navigate("/profile-user")}>Thông tin người dùng</p>
      {user?.isAdmin && (
        <p onClick={() => navigate("/Admin")}>Quản lí hệ thống</p>
      )}
      <p onClick={handleLogout}>Đăng xuất tài khoản</p>
    </div>
  );
  const navigate = useNavigate();
  const handleNavigatelogin = () => {
    navigate("/SignIn");
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-7">
          <div className="header__top__left">
            <p>
              Miễn phí vận chuyển, đảm bảo hoàn trả hoặc hoàn tiền trong 30
              ngày.
            </p>
          </div>
        </div>
        <div className="col-lg-6 col-md-5">
          <div className="header__top__right" style={{ textAlign: "center" }}>
            {userName ? (
              <>
                <Popover content={content} trigger="click">
                  <div
                    style={{
                      color: "#ffff",
                      textTransform: "uppercase",
                      fontWeight: "700",
                      fontStyle: "italic",
                      cursor: "pointer",
                    }}
                  >
                    Xin chào {userName}
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
                  }}
                >
                  Đăng nhập/Đăng ký
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
