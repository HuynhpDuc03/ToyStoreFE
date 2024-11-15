import { Button, Input, message } from "antd";
import React, { useState } from "react";
import * as UserService from "../../../src/services/UserService";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ForgotAndResetPassword = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async () => {
    if (!email) {
      message.destroy()
      message.error(t("pageForgotPassword.error")); 
      return;
    }

    setLoading(true);
    try {
      const response = await UserService.forgotPassword({ email });
      message.success(t("pageForgotPassword.sendOTP")); 
      setStep(2);
    } catch (error) {
      message.error(
        error.response?.data?.message || t("pageForgotPassword.error")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      message.destroy()
      message.error(t("pageForgotPassword.verifyError"));
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const response = await UserService.verifyOtp({ email, otp });
      message.success(t("pageForgotPassword.verifySuccess"));
      setStep(3);
    } catch (error) {
      message.error(
        error.response?.data?.message || t("pageForgotPassword.verifyError")
      );
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage(t("pageForgotPassword.error"));
      return;
    }

    setLoading(true);
    try {
      const response = await UserService.resetPassword({
        email,
        newPassword,
      });
      message.success(t("pageForgotPassword.success")); 
      navigate("/SignIn");
    } catch (error) {
      message.error(
        error.response?.data?.message || t("pageForgotPassword.error")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {step === 1 && (
        <div className="bg-light py-3 py-md-5">
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                <div className="bg-white p-4 p-md-5 rounded shadow-sm">
                  <div className="row gy-3 mb-5">
                    <div className="col-12 text-center">
                      <h2>{t("pageForgotPassword.title")}</h2>
                      <h2 className="fs-6 mt-3 fw-normal text-secondary">
                        {t("pageForgotPassword.subtitle")}
                      </h2>
                    </div>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleForgotPassword();
                    }}
                  >
                    <div className="row gy-3 gy-md-4 overflow-hidden">
                      <div className="col-12">
                        <label htmlFor="email" className="form-label">
                          {t("pageForgotPassword.email")}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <Input
                            size="large"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t(
                              "pageForgotPassword.emailPlaceholder"
                            )}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-grid">
                          <Button
                            type="primary"
                            size="large"
                            onClick={handleForgotPassword}
                            loading={loading}
                          >
                            {t("pageForgotPassword.submit")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-12">
                      <hr className="mt-5 mb-4 border-secondary-subtle" />
                      <div className="d-flex gap-4 justify-content-center">
                        <Link
                          to="/SignIn"
                          className="link-secondary text-decoration-none"
                        >
                          {t("pageRegister.login")}
                        </Link>
                        <Link
                          to="/Register"
                          className="link-secondary text-decoration-none"
                        >
                          {t("pageRegister.register")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-light py-3 py-md-5">
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                <div className="bg-white p-4 p-md-5 rounded shadow-sm">
                  <div className="row gy-3 mb-5">
                    <div className="col-12 text-center">
                      <h2>{t("pageForgotPassword.enterOTP")}</h2>
                      <h2 className="fs-6 mt-3 fw-normal text-secondary">
                        {t("pageForgotPassword.subtitleOTP")}
                      </h2>
                    </div>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div className="row gy-3 gy-md-4 overflow-hidden">
                      <div className="col-12">
                        <label htmlFor="otp" className="form-label">
                          OTP <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <Input
                            size="large"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder={t("pageForgotPassword.enterOTP")}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="d-grid">
                          <Button
                            type="primary"
                            size="large"
                            onClick={handleVerifyOtp}
                            loading={isVerifyingOtp}
                          >
                            {t("pageForgotPassword.submit")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-12">
                      <hr className="mt-5 mb-4 border-secondary-subtle" />
                      <div className="d-flex gap-4 justify-content-center">
                        <Link
                          to="/SignIn"
                          className="link-secondary text-decoration-none"
                        >
                          {t("pageRegister.login")}
                        </Link>
                        <Link
                          to="/Register"
                          className="link-secondary text-decoration-none"
                        >
                          {t("pageRegister.register")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-light py-3 py-md-5">
          <div className="container">
            <div className="row justify-content-md-center">
              <div className="col-12 col-md-11 col-lg-8 col-xl-7 col-xxl-6">
                <div className="bg-white p-4 p-md-5 rounded shadow-sm">
                  <div className="row gy-3 mb-5">
                    <div className="col-12 text-center">
                      <h2>{t("pageForgotPassword.newPassword")}</h2>
                    </div>
                  </div>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <div className="row gy-3 gy-md-4 overflow-hidden">
                      <div className="col-12">
                        <label htmlFor="newPassword" className="form-label">
                          {t("pageForgotPassword.newPassword")}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <Input
                            size="large"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder={t("pageForgotPassword.newPassword")}
                            required
                          />
                        </div>
                      </div>
                      <div className="col-12">
                        <label htmlFor="confirmPassword" className="form-label">
                          {t("pageForgotPassword.confirmPassword")}{" "}
                          <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <Input
                            size="large"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder={t(
                              "pageForgotPassword.confirmPassword"
                            )}
                            required
                          />
                        </div>
                      </div>
                      {errorMessage && (
                        <p className="text-danger">{errorMessage}</p>
                      )}
                      <div className="col-12">
                        <div className="d-grid">
                          <Button
                            type="primary"
                            size="large"
                            onClick={handleResetPassword}
                            loading={loading}
                          >
                            {t("pageForgotPassword.submit")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="row">
                    <div className="col-12">
                      <hr className="mt-5 mb-4 border-secondary-subtle" />
                      <div className="d-flex gap-4 justify-content-center">
                        <Link
                          to="/SignIn"
                          className="link-secondary text-decoration-none"
                        >
                          {t("pageRegister.login")}
                        </Link>
                        <Link
                          to="/Register"
                          className="link-secondary text-decoration-none"
                        >
                          {t("pageRegister.register")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotAndResetPassword;
