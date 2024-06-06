import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../../src/services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";

import { Input, message } from "antd";
import {
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

const Register = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();
  const handleOnchangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const mutation = useMutationHooks((data) => UserService.signupUser(data));

  const handleOnchangeUsername = (e) => {
    setName(e.target.value);
  };

  const handleOnchangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleOnchangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleOnchangePhone = (e) => {
    setPhone(e.target.value);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    mutation.mutate({
      email,
      name,
      password,
      confirmPassword,
      phone,
    });
  };

  const { data, isSuccess, isError, error } = mutation;
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message
        .open({
          type: "loading",
          content: "Loading...",
          duration: 1,
        })
        .then(() =>
          setTimeout(() => {
            message.success("Đăng ký thành công", 1.5);
            message.info("Vui lòng đăng nhập", 1.5);
            navigate("/SignIn");
          }, 1000)
        );
    } else if (isError || (data && data.status === "ERR")) {
      message.error(data?.message || error?.message || "Đăng ký thất bại");
    }
  }, [isSuccess, isError, data, error, navigate]);
  const Navigate = useNavigate();
  const handleNavigateSignIn = () => {
    Navigate("/SignIn");
  };
  return (
    <div className="container mt-5 pt-5" style={{ marginBottom: 200 }}>
      <div className="row">
        <div className="col-12 col-sm-8 col-md-6 m-auto">
          <div className="card border-0 shadow">
            <div className="card-body">
              <div className="text-center">
                <h2 className="mb-3" style={{ fontWeight: "bold" }}>
                  Đăng Ký
                </h2>
                <svg
                  className="mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  fill="currentColor"
                  class="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path
                    fill-rule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                  />
                </svg>
              </div>
              <form action="">
                <Input
                  className="mt-3"
                  type="text"
                  size="large"
                  value={name}
                  onChange={handleOnchangeUsername}
                  placeholder="Họ và Tên"
                  prefix={<UserOutlined />}
                />
                <br />
                <Input
                  className="mt-3"
                  type="email"
                  size="large"
                  value={email}
                  onChange={handleOnchangeEmail}
                  placeholder="Email"
                  prefix={<MailOutlined />}
                />
                <br />
                <Input.Password
                  className="mt-3"
                  
                  size="large"
                  value={password}
                  onChange={handleOnchangePassword}
                  placeholder="Mật khẩu"
                  prefix={<LockOutlined />}
                />
                <br />
                <Input.Password
                  className="mt-3"
                  
                  size="large"
                  value={confirmPassword}
                  onChange={handleOnchangeConfirmPassword}
                  placeholder="Nhập lại mật khẩu"
                  prefix={<LockOutlined />}
                />
                <br />
                <Input
                  className="mt-3"
                  type="number"
                  size="large"
                  value={phone}
                  onChange={handleOnchangePhone}
                  placeholder="Số điện thoại"
                  prefix={<PhoneOutlined />}
                />

               
                <div className="text-center mt-3">
                {data?.status === "ERR" && (
                  <span className="nav-link" style={{ color: "red" }}>{data?.message}</span>
                )}
                  <button
                    className="btn btn-primary"
                    onClick={handleSignUp}
                    style={{ width: "50%" }}
                    disabled={
                      !email.length ||
                      !name.length ||
                      !password.length ||
                      !confirmPassword.length ||
                      !phone.length
                    }
                  >
                    Đăng Ký
                  </button>
                  <hr width="100%" />
                  <span className="nav-link">
                    Bạn đã có tài khoản?{" "}
                    <span
                      style={{
                        cursor: "pointer",
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                      onClick={handleNavigateSignIn}
                    >
                      Đăng nhập
                    </span>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
