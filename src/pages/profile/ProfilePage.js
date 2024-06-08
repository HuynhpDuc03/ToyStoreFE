import {
  EnvironmentOutlined,
  PhoneOutlined,
  SmileOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as UserService from "../../../src/services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/userSlide";

import VnProvinces from "vn-local-plus";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    setEmail(user?.email);
    setName(user?.name);
    setPhone(user?.phone);
    setAddress(user?.address);
    setCity(user?.city);
    setDistrict(user?.district);
    setWard(user?.ward);
  }, [user]);

  const handleOnchangeName = (e) => {
    setName(e.target.value);
  };
  const handleOnchangePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleOnchangeAddress = (e) => {
    setAddress(e.target.value);
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = VnProvinces.getProvinces();
        setProvinces(res);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (city) {
        try {
          const res = VnProvinces.getDistrictsByProvinceCode(city);
          setDistricts(res);
          const currentDistrict = res.find((d) => d.code === district);
          if (currentDistrict) {
            setDistrict(currentDistrict.code);
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [city]);

  useEffect(() => {
    const fetchWards = async () => {
      if (district) {
        try {
          const res = VnProvinces.getWardsByDistrictCode(district);
          setWards(res);
          const currentWard = res.find((w) => w.code === ward);
          if (currentWard) {
            setWard(currentWard.code);
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      }
    };
    fetchWards();
  }, [district]);

  const handleProvinceChange = async (value) => {
    setCity(value);
    setDistrict("");
    setWard("");
    try {
      const res = VnProvinces.getDistrictsByProvinceCode(value);
      setDistricts(res);
      setWards([]);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (value) => {
    setDistrict(value);
    setWard("");
    try {
      const res = VnProvinces.getWardsByDistrictCode(value);
      setWards(res);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleWardChange = (value) => {
    setWard(value);
  };

  const handleUpdateClick = () => {
    setEditMode(true);
  };

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    UserService.UpdateUser(id, rests, access_token);
  });

  const { data, isSuccess, isError, error } = mutation;

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  useEffect(() => {
    if (isSuccess) {
      message.success("Cập nhật thành công");
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (isError) {
      message.error("Cập nhật thất bại");
    }
  }, [isSuccess, isError]);

  const handleSaveClick = () => {
    mutation.mutate({
      id: user?.id,
      name,
      phone,
      address,
      city,
      district,
      ward,
      access_token: user?.access_token,
    });
    setEditMode(false);
  };
  const handleClickNavigate = () => {
    navigate("/my-order", {
      state: {
        id: user?.id,
        name: user?.name,
        token: user?.access_token,
      },
    });
  };
  return (
    <div className="container pt-5" style={{ marginBottom: 200 }}>
      <div className="row">
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          TÀI KHOẢN
        </h2>
        <div className="col-3 col-sm-3 col-md-3 m-auto">
          <div className="card border-0 shadow" style={{ borderRadius: "5px" }}>
            <div
              style={{
                width: "100%",
                height: "40px",
                textAlign: "center",
                backgroundColor: "#000",
                borderTopLeftRadius: "5px",
                borderTopRightRadius: "5px",
              }}
            >
              <p
                style={{
                  fontSize: "18px",
                  lineHeight: "40px",
                  color: "#fff",
                  fontWeight: "700",
                }}
              >
                <SmileOutlined /> Chào {user?.name}
              </p>
            </div>
            <div className="card-body">
              <div className="shop__sidebar__categories">
                <ul>
                  <li>
                    <Link style={{ color: "#000" }}>
                      <UserOutlined /> Tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link
                      onClick={(e) => {
                        e.preventDefault();
                        handleClickNavigate();
                      }}
                    >
                      <TruckOutlined /> Thông tin đơn hàng
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-9 col-sm-9 col-md-9 m-auto">
          <div className="card border-0 shadow">
            <div className="card-body">
              <Form action="">
                <label style={{ display: "inline-block", width: "10%" }}>
                  Email:
                </label>
                <span>{email}</span>
                <br />
                <label style={{ display: "inline-block", width: "10%" }}>
                  Họ tên:
                </label>
                <Input
                  className="mt-3"
                  style={{ width: "88%" }}
                  type="text"
                  size="large"
                  value={name}
                  onChange={handleOnchangeName}
                  placeholder="Họ và Tên"
                  prefix={<UserOutlined />}
                  disabled={!editMode}
                />
                <br />
                <label style={{ display: "inline-block", width: "10%" }}>
                  Điện thoại:
                </label>
                <Input
                  className="mt-3"
                  type="number"
                  style={{ width: "88%" }}
                  size="large"
                  value={phone}
                  onChange={handleOnchangePhone}
                  placeholder="Số điện thoại"
                  prefix={<PhoneOutlined />}
                  disabled={!editMode}
                />
                <div className="container">
                  <div className="row">
                    <div
                      className="col-md-4 mt-3"
                      style={{ paddingLeft: "0px" }}
                    >
                      <Select
                        defaultValue="Chọn tỉnh thành"
                        value={city || undefined}
                        style={{ width: "100%" }}
                        onChange={handleProvinceChange}
                        options={[
                          { value: "", label: "Chọn tỉnh thành" },
                          ...provinces.map((province) => ({
                            value: province.code,
                            label: province.name,
                          })),
                        ]}
                        disabled={!editMode}
                      />
                    </div>
                    <div className="col-md-4 mt-3">
                      <Select
                        defaultValue="Chọn quận huyện"
                        style={{ width: "100%" }}
                        onChange={handleDistrictChange}
                        value={district || undefined}
                        options={[
                          { value: "", label: "Chọn quận huyện" },
                          ...districts.map((district) => ({
                            value: district.code,
                            label: district.name,
                          })),
                        ]}
                        disabled={!editMode || !city}
                      />
                    </div>
                    <div className="col-md-4 mt-3">
                      <Select
                        defaultValue="Chọn phường xã"
                        value={ward || undefined}
                        style={{ width: "100%" }}
                        onChange={handleWardChange}
                        options={[
                          { value: "", label: "Chọn phường xã" },
                          ...wards.map((ward) => ({
                            value: ward.code,
                            label: ward.name,
                          })),
                        ]}
                        disabled={!editMode || !district}
                      />
                    </div>
                  </div>
                </div>
                <label style={{ display: "inline-block", width: "10%" }}>
                  Địa chỉ:
                </label>
                <Input
                  className="mt-3"
                  type="text"
                  size="large"
                  style={{ width: "88%" }}
                  value={address}
                  onChange={handleOnchangeAddress}
                  placeholder="Địa chỉ"
                  prefix={<EnvironmentOutlined />}
                  disabled={!editMode}
                />
                <div className="text-left mt-3">
                  {editMode ? (
                    <Button
                      type="primary"
                      style={{ width: "20%", float: "right" }}
                      onClick={handleSaveClick}
                    >
                      Lưu thông tin
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      style={{ width: "20%" }}
                      onClick={handleUpdateClick}
                    >
                      Cập nhật
                    </Button>
                  )}
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
