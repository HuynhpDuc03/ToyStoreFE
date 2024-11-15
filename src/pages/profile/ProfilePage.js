import {
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SmileOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Menu, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as UserService from "../../../src/services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/userSlide";

import VnProvinces from "vn-local-plus";
import { useTranslation } from "react-i18next";

const ProfilePage = () => {
  const { t } = useTranslation();
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

  const { data, isSuccess, isError } = mutation;

  const handleGetDetailUser = async (id, token) => {
    const res = await UserService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  useEffect(() => {
    if (isSuccess) {
      message.destroy()
      message.success(t("pageProfile.updateSuccess"));
      handleGetDetailUser(user?.id, user?.access_token);
    } else if (isError) {
      message.destroy()
      message.error(t("pageProfile.updateFailure"));
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
        token: user?.access_token,
      },
    });
  };

  const items = [
    {
      key: "profile",
      label: "Profile",
      type: "group",
      children: [
        {
          key: "1",
          label: (
            <span>
              <UserOutlined /> {t("pageProfile.account1")}
            </span>
          ),
        },

        {
          key: "2",
          label: (
            <span>
              <TruckOutlined /> {t("pageProfile.orderInfo")}
            </span>
          ),
          onClick: handleClickNavigate,
        },
      ],
    },
  ];
  return (
    <div className="container pt-5" style={{ marginBottom: 200 }}>
      <div className="row">
        <div className="col-2 col-sm-2 col-md-2">
          <Menu
            style={{
              width: "100%",
            }}
            defaultSelectedKeys={"1"}
            mode="inline"
            items={items}
          />
        </div>
        <div className="col-10 col-sm-10 col-md-10 m-auto">
          <div className="card border-0 shadow rounded">
            <div className="card-body p-4">
              <h3>{t("pageProfile.accountTitle")}</h3>
              <p>{t("pageProfile.subTitle")}</p>
              <hr />
              <Form action="">
                <div className="row">
                  <div className="col-md-6  ">
                    <Form.Item>
                      <label className="mb-2 font-weight-bold">
                        {t("pageProfile.Email")}: {}
                      </label>
                      <Input
                        className="mt-2"
                        style={{ width: "100%" }}
                        type="text"
                        size="large"
                        value={email}
                        prefix={<MailOutlined />}
                        disabled={true}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-6 ">
                    <Form.Item>
                      <label className="mb-2 font-weight-bold">
                        {t("pageProfile.name")}:
                      </label>
                      <Input
                        className="mt-2"
                        style={{ width: "100%" }}
                        type="text"
                        size="large"
                        value={name}
                        onChange={handleOnchangeName}
                        placeholder={t("pageProfile.name")}
                        prefix={<UserOutlined />}
                        disabled={!editMode}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                  <label className="mb-2 font-weight-bold">
                        {/* {t("pageProfile.address")}: */} Chọn Tỉnh/Thành
                      </label>
                    <Select
                      placeholder={t("pageProfile.city")}
                      value={city || undefined}
                      style={{ width: "100%" }}
                      onChange={handleProvinceChange}
                      options={[
                        { value: "", label: t("pageProfile.city") },
                        ...provinces.map((province) => ({
                          value: province.code,
                          label: province.name,
                        })),
                      ]}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                  <label className="mb-2 font-weight-bold">
                        {/* {t("pageProfile.address")}: */}
                        Chọn quận/huyện
                      </label>
                    <Select
                      placeholder={t("pageProfile.district")}
                      style={{ width: "100%" }}
                      onChange={handleDistrictChange}
                      value={district || undefined}
                      options={[
                        { value: "", label: t("pageProfile.district") },
                        ...districts.map((district) => ({
                          value: district.code,
                          label: district.name,
                        })),
                      ]}
                      disabled={!editMode || !city}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                  <label className="mb-2 font-weight-bold">
                        {/* {t("pageProfile.address")}: */}
                        Chọn phường/xã
                      </label>
                    <Select
                      placeholder={t("pageProfile.street")}
                      value={ward || undefined}
                      style={{ width: "100%" }}
                      onChange={handleWardChange}
                      options={[
                        { value: "", label: t("pageProfile.street") },
                        ...wards.map((ward) => ({
                          value: ward.code,
                          label: ward.name,
                        })),
                      ]}
                      disabled={!editMode || !district}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4  ">
                    <Form.Item>
                      <label className="mb-2 font-weight-bold">
                        {t("pageProfile.phone")}:
                      </label>
                      <Input
                        className="mt-2"
                        type="number"
                        style={{ width: "100%" }}
                        size="large"
                        value={phone}
                        onChange={handleOnchangePhone}
                        placeholder={t("pageProfile.phone")}
                        prefix={<PhoneOutlined />}
                        disabled={!editMode}
                      />
                    </Form.Item>
                  </div>
                  <div className="col-md-8 ">
                    <Form.Item>
                      <label className="mb-2 font-weight-bold">
                        {t("pageProfile.address")}:
                      </label>
                      <Input
                        className="mt-2"
                        type="text"
                        style={{ width: "100%" }}
                        size="large"
                        value={address}
                        onChange={handleOnchangeAddress}
                        placeholder={t("pageProfile.address")}
                        prefix={<EnvironmentOutlined />}
                        disabled={!editMode}
                      />
                    </Form.Item>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  {!editMode && (
                    <Button
                      size="large"
                      type="primary"
                      onClick={handleUpdateClick}
                    >
                      {t("pageProfile.update")}
                    </Button>
                  )}
                  {editMode && (
                    <Button
                      size="large"
                      type="primary"
                      onClick={handleSaveClick}
                    >
                      {t("pageProfile.save")}
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
