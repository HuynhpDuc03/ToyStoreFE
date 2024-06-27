import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import * as UserService from "../src/services/UserService";
import { jwtDecode } from "jwt-decode";


import { useDispatch, useSelector } from "react-redux";
import { updateUser } from ".././src/redux/userSlide";
import { isJsonString } from "./utils";

//css
import "../src/css/bootstrap.min.css";
import "../src/css/font-awesome.min.css";
import "../src/css/elegant-icons.css";
import "../src/css/magnific-popup.css";
import "../src/css/nice-select.css";
import "../src/css/owl.carousel.min.css";
import "../src/css/slicknav.min.css";
import "../src/css/style.css";
import "../src/css/404.css";
import "../src/css/userMenu.css";
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleDecoded = () => {
    let storageData = localStorage.getItem("token");
    let decoded = {};
    if (storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData);
      try {
        decoded = jwtDecode(storageData);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
    return { decoded, storageData };
  };

  const handleGetDetailUser = async (id, token) => {
    try {
      const res = await UserService.getDetailsUser(id, token);
      dispatch(updateUser({ ...res?.data, access_token: token }));
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    const { storageData, decoded } = handleDecoded();
    if (decoded?.id) {
      handleGetDetailUser(decoded?.id, storageData);
    }
  }, []);


  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date();
      const { decoded, storageData } = handleDecoded();
      if (decoded?.exp < currentTime.getTime() / 1000) {
        try {
          const data = await UserService.refreshToken(storageData.refresh_token);
          localStorage.setItem("access_token", JSON.stringify(data?.access_token));
          config.headers["token"] = `Bearer ${data?.access_token}`;
        } catch (error) {
          console.error("Error refreshing token", error);
        }
      } else if (storageData) {
        config.headers["token"] = `Bearer ${storageData}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );



  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            const ischeckAuth = !route.isPrivate || user.isAdmin;
            const Layout = route.isShowHearder ? DefaultComponent : Fragment;
            return (
              <Route
                key={route.path}
                path={ischeckAuth ? route.path : ""}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
