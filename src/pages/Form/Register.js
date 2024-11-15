import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../../src/services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";

import { Input, message, Button } from "antd";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleOnchangeEmail = (e) => setEmail(e.target.value);
  const handleOnchangeUsername = (e) => setName(e.target.value);
  const handleOnchangePassword = (e) => setPassword(e.target.value);
  const handleOnchangeConfirmPassword = (e) => setConfirmPassword(e.target.value);
  const handleOnchangePhone = (e) => setPhone(e.target.value);

  const mutation = useMutationHooks((data) => UserService.signupUser(data));

  const handleSignUp = (e) => {
    e.preventDefault();
    mutation.mutate({ email, name, password, confirmPassword, phone });
  };

  const { data, isSuccess, isError, error } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.destroy()
      message
        .open({ type: "loading", content: "Loading...", duration: 1 })
        .then(() => {
          setTimeout(() => {
            message.success(t("pageRegister.success"), 1.5);
            message.info(t("pageRegister.pleaseLogin"), 1.5);
            navigate("/SignIn");
          }, 1000);
        });
    } else if (isError || (data && data.status === "ERR")) {
      message.destroy()
      message.error(data?.message || error?.message || t("pageRegister.failure"));
    }
  }, [isSuccess, isError, data, error, navigate]);

  return (
    <div className="bg-light py-3 py-md-5">
      <div className="container">
        <div className="row justify-content-md-center">
          <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
            <div className="bg-white p-4 p-md-5 rounded shadow-sm">
              <div className="row gy-3 mb-5">
                <div className="col-12">
                  <div className="text-center">
                    <h2>{t("pageRegister.register")}</h2>
                  </div>
                </div>
              </div>
              <form onSubmit={handleSignUp}>
                <div className="row gy-3 gy-md-4 overflow-hidden">
                  <div className="col-12">
                    <label htmlFor="name" className="form-label">
                      {t("pageRegister.name")} <span className="text-danger">*</span>
                    </label>
                    <Input
                      size="large"
                      type="text"
                      value={name}
                      onChange={handleOnchangeUsername}
                      placeholder={t("pageRegister.name")}
                      prefix={<UserOutlined />}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">
                      {t("pageRegister.email")} <span className="text-danger">*</span>
                    </label>
                    <Input
                      size="large"
                      type="email"
                      value={email}
                      onChange={handleOnchangeEmail}
                      placeholder={t("pageRegister.email")}
                      prefix={<MailOutlined />}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="phone" className="form-label">
                      {t("pageRegister.phone")} <span className="text-danger">*</span>
                    </label>
                    <Input
                      size="large"
                      type="number"
                      value={phone}
                      onChange={handleOnchangePhone}
                      placeholder={t("pageRegister.phone")}
                      prefix={<PhoneOutlined />}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="password" className="form-label">
                      {t("pageRegister.password")} <span className="text-danger">*</span>
                    </label>
                    <Input.Password
                      size="large"
                      value={password}
                      onChange={handleOnchangePassword}
                      placeholder={t("pageRegister.password")}
                      prefix={<LockOutlined />}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label htmlFor="confirmPassword" className="form-label">
                      {t("pageRegister.confirmPassword")} <span className="text-danger">*</span>
                    </label>
                    <Input.Password
                      size="large"
                      value={confirmPassword}
                      onChange={handleOnchangeConfirmPassword}
                      placeholder={t("pageRegister.confirmPassword")}
                      prefix={<LockOutlined />}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <div className="d-grid">
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleSignUp}
                        disabled={!email || !name || !password || !confirmPassword || !phone}
                      >
                        {t("pageRegister.signUp")}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
              <div className="row">
                <div className="col-12">
                  <hr className="mt-5 mb-4 border-secondary-subtle" />
                  <div className="d-flex gap-4 justify-content-center">
                    <a href="/SignIn" className="link-secondary text-decoration-none">
                      {t("pageRegister.haveAccount")} {t("pageRegister.login")}
                    </a>
                    <a href="/Register" className="link-secondary text-decoration-none">
                      {t("pageRegister.register")}
                    </a>
                  </div>
                </div>
              </div>
              {data?.status === "ERR" && (
                <div className="text-center text-danger mt-3">{data?.message}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
