import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as UserService from "../../../src/services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Button, Checkbox, Input, message } from "antd";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/userSlide";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const Signin = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isSuccess, isError, error } = mutation;
  
  const handleGetDetailUser = async (id, token) => {
    if (!token) return;
    try {
      const storage = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storage);

      const res = await UserService.getDetailsUser(id, token);
      dispatch(
        updateUser({ ...res?.data, access_token: token, refreshToken })
      );
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết người dùng:", error);
    }
  };
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.destroy()
      message.loading("Loading...", 0.75).then(() => {
        message.success(t("pageLogin.loginSuccess"), 1.5);
        const redirectURL = localStorage.getItem("redirectURL");
        if (redirectURL) {
          localStorage.removeItem("redirectURL");
          navigate(redirectURL);
        } else {
          navigate("/");
        }
      });

      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      localStorage.setItem("refresh_token", JSON.stringify(data?.refresh_token));
      
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailUser(decoded?.id, data?.access_token);
        }
      }
    } else if (isError || (isSuccess && data?.status === "ERR")) {
      setLoginError(
        data?.message || error?.message || t("pageLogin.loginFailure")
      );
    }
  }, [isSuccess, isError, error, data, navigate,handleGetDetailUser]);

  

  const handleSignIn = (e) => {
    e.preventDefault();
    setLoginError(null);
    mutation.mutate({ email, password });
  };

  return (
    <div className="bg-light py-3 py-md-5">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
            <div className="bg-white p-4 p-md-5 rounded shadow-sm">
              <div className="row gy-3 mb-5">
                <div className="col-12">
                  <div className="text-center">
                    <h2>{t("pageLogin.login")}</h2>
                    {loginError && (
                      <div className="text-center text-danger mt-3">
                       {loginError}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <form onSubmit={handleSignIn}>
                <div className="row gy-3 gy-md-4 overflow-hidden">
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      {t("pageLogin.email")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <Input
                      size="large"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("pageForgotPassword.emailPlaceholder")}
                      prefix={<MailOutlined />}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="password" className="form-label">
                      {t("pageLogin.password")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <Input.Password
                      size="large"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t("pageForgotPassword.passwordPlaceholder")}
                      prefix={<LockOutlined />}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <div className="d-flex justify-content-between">
                      <Checkbox>{t("pageLogin.rememberMe")}</Checkbox>
                      <Link to="/forgotPassword" className="link-secondary">
                        {t("pageLogin.forgotPassword")}
                      </Link>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-grid">
                      <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        disabled={!email.length || !password.length}
                      >
                        {t("pageLogin.login")}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="row">
                <div className="col-12">
                  <hr className="mt-5 mb-4 border-secondary-subtle" />
                  <div className="d-flex gap-4 justify-content-center">
                    <Link to="/Register" className="link-secondary">
                      {t("pageLogin.noAccount")} {t("pageLogin.createAccount")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
