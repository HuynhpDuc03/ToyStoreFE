import { Form, Button, theme, Layout, Select, message, Switch } from "antd";
import React, { useEffect, useState } from "react";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useQuery } from "@tanstack/react-query";
import TableComponent from "../../components/TableComponent/TableComponent";
import {
  DeleteOutlined,
  EditOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import ModalComponent from "../../components/ModalComponent/ModalComponent";
import SiderComponent from "../../components/SiderComponent/SiderComponent";
import { Content, Header } from "antd/es/layout/layout";
import {
  getDistrictByCode,
  getDistrictsByProvinceCode,
  getProvinceByCode,
  getProvinces,
  getWardByCode,
  getWardsByDistrictCode,
} from "vn-local-plus";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";

const UserAdmin = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [marginLeft, setMarginLeft] = useState(200);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 200 : 80);
  };

  const user = useSelector((state) => state?.user);
  const [rowSelected, setRowSelected] = useState("");
  const [OpenDrawer, setOpenDrawer] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isLoadingUpdate, setIsLoaddingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);

  // Dữ liệu cho select tỉnh, huyện, xã
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [dataTable, setDataTable] = useState([]);
  const [loadingDrawer, setLoadingDrawer] = useState(false);

  const inittial = () => ({
    name: "",
    email: "",
    isAdmin: false,
    phone: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    isBlock: false,

  });

  const [stateUser, setStateUser] = useState(inittial());

  const [stateUserDetails, setStateUserDetails] = useState(inittial());

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.UpdateUser(id, { ...rests }, token);
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = UserService.deleteUser(id, token);
    return res;
  });

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected);
    if (res?.data) {
      const city = res?.data?.city;
      const district = res?.data?.district;
      const ward = res?.data?.ward;

      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        city,
        district,
        ward,
        isBlock: res?.data?.isBlock,
      });

      if (city) {
        const districtsData = await getDistrictsByProvinceCode(city);
        setDistricts(districtsData);

        if (district) {
          const wardsData = await getWardsByDistrictCode(district);
          setWards(wardsData);
        }
      }
    }
    setIsLoaddingUpdate(false);
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (rowSelected && OpenDrawer) {
      setIsLoaddingUpdate(true);
      fetchGetDetailsUser(rowSelected);
    }
  }, [rowSelected, OpenDrawer]);

  const showDrawer = () => {
    setOpenDrawer(true);
    setLoadingDrawer(true);

    setTimeout(() => {
      setLoadingDrawer(false);
    }, 1000);
  };

  const onClose = () => {
    setOpenDrawer(false);
    form.resetFields(); // Reset form
    setStateUserDetails(inittial()); // Reset stateUserDetails
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
  };

  const getAllUsers = async () => {
    const res = await UserService.getAllUSer();
    return res;
  };

  const {
    data: dataUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;
  const {
    data: dataDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const { isLoading: isLoadingUsers, data: users } = queryUser;
  const renderAction = () => {
    return (
      <div>
        <EditOutlined
          onClick={showDrawer}
          style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
        />
        <DeleteOutlined
          onClick={() => setIsModalOpenDelete(true)}
          style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
        />
      </div>
    );
  };
  const columns = [
    {
      title: "Khóa",
      dataIndex: "isBlock",
      render: (text, record) => (
        <Switch
        checked={record?.isBlock}
        onChange={(checked) => handleToggleBlock(record?._id, checked)}
        />
      ),
      width: "20%",
      responsive: ["md"],
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      width: "20%",
      responsive: ["lg"],
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "20%",
      responsive: ["lg"],
    },

    {
      title: "Số điện thoại",
      dataIndex: "phone",
      width: "20%",
      responsive: ["lg"],
    },
    {
      title: "Chức năng",
      dataIndex: "Action",
      render: renderAction,
      width: "20%",
      responsive: ["md"],
    },
  ];

  useEffect(() => {
    const fetchNames = async () => {
      if (users?.data?.length) {
        const updatedUsers = await Promise.all(
          users.data.map(async (user) => {
            const cityName = user.city
              ? (await getProvinceByCode(user.city))?.name
              : "";
            const districtName = user.district
              ? (await getDistrictByCode(user.district))?.name
              : "";
            const wardName = user.ward
              ? (await getWardByCode(user.ward))?.name
              : "";
            return {
              ...user,
              key: user._id,
              isAdmin: user.isAdmin ? "True" : "False",
              city: cityName,
              district: districtName,
              ward: wardName,
            };
          })
        );
        setDataTable(updatedUsers);
      }
    };
    fetchNames();
  }, [users]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.destroy()
      message.success();
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.destroy()
      message.error();
    }
  }, [isSuccessDeleted]);

  
  const mutationUpdateBlockStatus = useMutationHooks((data) => {
    const { id, isBlock, token } = data;
    return UserService.updateIsBlock({ id, isBlock }, token); 
  });

  const handleToggleBlock = (userId, isBlocked) => {
    console.log("isBlocked",isBlocked)
    mutationUpdateBlockStatus.mutate(
      { id: userId, isBlock: isBlocked, token: user?.access_token }, 
      {
        onSuccess: (response) => {
          if (response.status === "OK") {
            message.success("Cập nhật trạng thái thành công!");
            queryUser.refetch(); // Làm mới danh sách người dùng
          } else {
            message.error(response.message || "Cập nhật trạng thái thất bại.");
          }
        },
        onError: (error) => {
          console.error("Error updating block status:", error);
          message.error("Đã xảy ra lỗi khi cập nhật trạng thái.");
        },
      }
    );
  };



  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setStateUserDetails(inittial());
    setSelectedProvince("");
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
    form.resetFields();
  };
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.destroy()
      message.success("Cập nhật thông tin người dùng thành công.");
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.destroy()
      message.error("Có lỗi khi cập nhật thông tin người dùng");
    }
  }, [isSuccessUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteUser = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryUser.refetch();
          message.destroy()
          message.success("Xóa tài khoản thành công.")
        },
      }
    );
  };

  const hanleOnChangeDetail = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateUser = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateUserDetails },
      {
        onSettled: () => {
          queryUser.refetch();
        },
      }
    );
  };

  useEffect(() => {
    const fetchProvinces = async () => {
      const provincesData = await getProvinces();
      setProvinces(provincesData);
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      const fetchDistricts = async () => {
        const districtsData = await getDistrictsByProvinceCode(
          selectedProvince
        );
        setDistricts(districtsData);
      };
      fetchDistricts();
    }
  }, [selectedProvince]);

  const handleProvinceChange = (value) => {
    setSelectedProvince(value);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts([]);
    setWards([]);
    form.setFieldsValue({ district: "", ward: "" });
    setStateUserDetails((prevState) => ({
      ...prevState,
      city: value,
      district: "",
      ward: "",
    }));
  };

  useEffect(() => {
    if (selectedDistrict) {
      const fetchWards = async () => {
        const wardsData = await getWardsByDistrictCode(selectedDistrict);
        setWards(wardsData);
      };
      fetchWards();
    }
  }, [selectedDistrict]);

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedWard("");
    setWards([]);
    form.setFieldsValue({ ward: "" });
    setStateUserDetails((prevState) => ({
      ...prevState,
      district: value,
      ward: "",
    }));
  };

  return (
    <LoadingComponent isLoading={isLoadingUsers}>
      <Layout>
        <SiderComponent collapsed={collapsed} user={user} selectKey={"4"} />
        <Layout
          style={{
            height: "100%",
            minHeight: "750px",
            marginLeft: marginLeft,
            transition: "margin-left 0.4s ease",
          }}
        >
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => toggleCollapsed()}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
            <h5 style={{ display: "inline-block", marginLeft: "20px" }}>
              QUẢN LÝ NGƯỜI DÙNG
            </h5>
          </Header>

          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div>
              <ModalComponent
                forceRender
                title="Chi tiết người dùng"
                onCancel={onClose}
                open={OpenDrawer}
                loading={loadingDrawer}
                width="60%"
                style={{
                  top: 50,
                }}
                footer={null}
              >
                <Form
                  name="basic"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                  onFinish={onUpdateUser}
                  autoComplete="on"
                  form={form}
                >
                  <Form.Item
                    label="Họ tên"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhập họ tên !",
                      },
                    ]}
                  >
                    <InputComponent
                      value={stateUserDetails.name}
                      onChange={hanleOnChangeDetail}
                      name="name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: "Hãy nhập Email!" }]}
                  >
                    <InputComponent
                      value={stateUserDetails.email}
                      onChange={hanleOnChangeDetail}
                      name="email"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[
                      { required: true, message: "Hãy nhập số điện thoại!" },
                    ]}
                  >
                    <InputComponent
                      value={stateUserDetails.phone}
                      onChange={hanleOnChangeDetail}
                      name="phone"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: "Hãy nhập địa chỉ!" }]}
                  >
                    <InputComponent
                      value={stateUserDetails.address}
                      onChange={hanleOnChangeDetail}
                      name="address"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Tỉnh/Thành"
                    name="city"
                    rules={[
                      { required: true, message: "Hãy nhập tỉnh thành!" },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select a city"
                      onChange={handleProvinceChange}
                      value={stateUserDetails.city}
                    >
                      {provinces.map((province) => (
                        <Select.Option
                          key={province.code}
                          value={province.code}
                        >
                          {province.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Quận/Huyện"
                    name="district"
                    rules={[
                      { required: true, message: "Hãy nhập quận huyện!" },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select a district"
                      onChange={handleDistrictChange}
                      value={stateUserDetails.district}
                    >
                      {districts.map((district) => (
                        <Select.Option
                          key={district.code}
                          value={district.code}
                        >
                          {district.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    label="Phường/Xã"
                    name="ward"
                    rules={[
                      {
                        required: true,
                        message: "Hãy nhập phường xã!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Select a ward"
                      onChange={(value) => {
                        form.setFieldsValue({ ward: value });
                        setStateUserDetails((prevState) => ({
                          ...prevState,
                          ward: value,
                        }));
                      }}
                      value={stateUserDetails.ward}
                    >
                      {wards.map((ward) => (
                        <Select.Option key={ward.code} value={ward.code}>
                          {ward.name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item wrapperCol={{ offset: 20, span: 20 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "90%" }}
                    >
                      Lưu
                    </Button>
                  </Form.Item>
                </Form>
              </ModalComponent>

              <ModalComponent
                title="Xóa người dùng"
                open={isModalOpenDelete}
                onCancel={handleCancelDelete}
                onOk={handleDeleteUser}
              >
                <div>Bạn có chắc xóa tài khoản này không</div>
              </ModalComponent>
            </div>

            <TableComponent
              columns={columns}
              isLoading={isLoadingUsers}
              data={dataTable}
              pagination={{
                position: ["bottomCenter"],
                pageSize: 7,
              }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    setRowSelected(record._id);
                  },
                };
              }}
            />
          </Content>
        </Layout>
      </Layout>
    </LoadingComponent>
  );
};

export default UserAdmin;
