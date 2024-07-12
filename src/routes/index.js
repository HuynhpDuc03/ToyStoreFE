import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import ProductDetail from "../pages/ProductPage/ProductDetail";
import CheckOut from "../pages/OrderPage/CheckOut";
import Signin from "../pages/Form/Signin";
import Register from "../pages/Form/Register";
import ProfilePage from "../pages/profile/ProfilePage";
import Admin from "../../src/pages/Admin/admin";

import Order from "../../src/pages/Admin/order";
import ProductType from "../pages/ProductPage/productType";
import OrderSuccess from "../pages/OrderPage/OrderSuccess";
import MyOrderPage from "../pages/profile/MyOrderPage";
import DetailsOrderPage from "../pages/profile/DetailsOrderPage";
import UserAdmin from "../pages/Admin/UserAdmin";
import ProductFavorite from "../pages/ProductPage/ProductFavourite";


export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHearder: true,
  },
  {
    path: "/order",
    page: OrderPage,
    isShowHearder: true,
  },
  {
    path: "/products",
    page: ProductPage,
    isShowHearder: true,
  },

  {
    path: "/productsDetail/:id",
    page: ProductDetail,
    isShowHearder: true,
  },
  {
    path: "/products/:type",
    page: ProductType,
    isShowHearder: true,
  },
  {
    path: "/productFavorite",
    page: ProductFavorite,
    isShowHearder: true,
  },

  {
    path: "/Order",
    page: OrderPage,
    isShowHearder: true,
  },
  {
    path: "/Checkout",
    page: CheckOut,
    isShowHearder: true,
  },
  {
    path: "/OrderSuccess",
    page: OrderSuccess,
    isShowHearder: true,
  },
  {
    path: "/SignIn",
    page: Signin,
    isShowHearder: true,
  },
  {
    path: "/Register",
    page: Register,
    isShowHearder: true,
  },
  {
    path: "/profile-user",
    page: ProfilePage,
    isShowHearder: true,
  },
  {
    path: "/my-order",
    page: MyOrderPage,
    isShowHearder: true,
  },
  {
    path: "/details-order/:id",
    page: DetailsOrderPage,
    isShowHearder: true,
  },
  {
    path: "/Admin",
    page: Admin,
    isShowHearder: false,
    isPrivate: true,
  },
  {
    path: "/AdminOrder",
    page: Order,
    isShowHearder: false,
  },
  {
    path: "/AdminUser",
    page: UserAdmin,
    isShowHearder: false,
  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
