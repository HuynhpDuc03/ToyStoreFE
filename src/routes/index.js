import HomePage from "../pages/HomePage/HomePage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import ProductPage from "../pages/ProductPage/ProductPage";
import ProductDetail from "../pages/ProductPage/ProductDetail";
import CheckOut from "../pages/OrderPage/CheckOut";
import Signin from "../pages/Form/Signin";
import Register from "../pages/Form/Register";
import ProfilePage from "../pages/profile/ProfilePage";
import ProductAdmin from "../../src/pages/Admin/ProductAdmin";

import OrderAdmin from "../pages/Admin/OrderAdmin";
import ProductType from "../pages/ProductPage/productType";
import OrderSuccess from "../pages/OrderPage/OrderSuccess";
import MyOrderPage from "../pages/profile/MyOrderPage";
import DetailsOrderPage from "../pages/profile/DetailsOrderPage";
import UserAdmin from "../pages/Admin/UserAdmin";
import ProductFavorite from "../pages/ProductPage/ProductFavourite";
import OrderDetails from "../pages/Admin/OrderDetails";
import CouponAdmin from "../pages/Admin/CouponAdmin";
import Dashboard from "../pages/Admin/Dashboard";
import ContactPage from "../pages/Contact/ContactPage";
import BlogPageDetails from "../pages/Blog/BlogDetailsPage";
import BlogPage from "../pages/Blog/BlogPage";
import BlogAdmin from "../pages/Admin/BlogAdmin/BlogAdmin";
import CreateBlog from "../pages/Admin/BlogAdmin/CreateBlog";
import EditBlog from "../pages/Admin/BlogAdmin/EditBlog";
import ForgotAndResetPassword from "../pages/profile/ForgotAndResetPassword";


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
    path: "/blogs",
    page: BlogPage,
    isShowHearder: true,
  },
  {
    path: "/blogdetails/:id",
    page: BlogPageDetails,
    isShowHearder: true,
  },
  {
    path: "/contact",
    page: ContactPage,
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
    path: "/forgotPassword",
    page: ForgotAndResetPassword,
    isShowHearder: true,
  },
  {
    path: "/details-order/:id",
    page: DetailsOrderPage,
    isShowHearder: true,
  },
  {
    path: "/AdminProduct",
    page: ProductAdmin,
    isShowHearder: false,
    isPrivate: true,
  },
  {
    path: "/Dashboard",
    page: Dashboard,
    isShowHearder: false,
    isPrivate: true,
  },
  {
    path: "/AdminOrder",
    page: OrderAdmin,
    isShowHearder: false,
    isPrivate: true,

  },
  {
    path: "/AdminOrderDetails/:id",
    page: OrderDetails,
    isShowHearder: false,
    isPrivate: true,

  },
  {
    path: "/AdminUser",
    page: UserAdmin,
    isShowHearder: false,
    isPrivate: true,

  },
  {
    path: "/AdminCoupon",
    page: CouponAdmin,
    isShowHearder: false,
    isPrivate: true,

  },
  {
    path: "/AdminBlog",
    page: BlogAdmin,
    isShowHearder: false,
    isPrivate: true,

  },
  {
    path: "/CreateBlog",
    page: CreateBlog,
    isShowHearder: false,
    isPrivate: true,

  },
  {
    path: "/EditBlog/:id",
    page: EditBlog,
    isShowHearder: false,
    isPrivate: true,

  },
  {
    path: "*",
    page: NotFoundPage,
  },
];
