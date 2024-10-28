import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Drawer,
  Layout,
  Modal,
  InputNumber,
  DatePicker,
  theme,
  message,
} from "antd";
import {
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import SiderComponent from "../../components/SiderComponent/SiderComponent";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { useQuery } from "@tanstack/react-query";
import InputComponent from "../../components/InputComponent/InputComponent";
import * as CouponService from "../../services/CouponService";
import TableComponent from "../../components/TableComponent/TableComponent";
import moment from "moment/moment";
import ModalComponent from "../../components/ModalComponent/ModalComponent";

const { Content, Header } = Layout;

const CouponAdmin = () => {
  const user = useSelector((state) => state?.user);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [marginLeft, setMarginLeft] = useState(200);
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 200 : 80);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [OpenDrawer, setOpenDrawer] = useState(false);

  const [isLoadingUpdate, setIsLoaddingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const [loadingDrawer, setLoadingDrawer] = useState(true);

  const inittial = () => ({
    name: "",
    discount: "",
    startDate: "",
    endDate: "",
  });

  const [stateCoupon, setStateCoupon] = useState(inittial());

  const [stateCouponDetail, setStateCouponDetail] = useState(inittial());

  const [form] = Form.useForm();

  const mutation = useMutationHooks(() => {
    const res = CouponService.createCoupon(user?.access_token);
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = CouponService.updateCoupon(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = CouponService.deleteCoupon(id, token);
    return res;
  });

  const fetchGetDetailsCoupon = async (rowSelected) => {
    const res = await CouponService.getDetailCoupons(rowSelected);
    if (res?.data) {
      setStateCouponDetail({
        name: res?.data?.name,
        discount: res?.data?.discount,
        startDate: moment(res?.data?.startDate),
        endDate: moment(res?.data?.endDate),
      });
    }
    setIsLoaddingUpdate(false);
  };

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateCouponDetail);
    } else {
      form.setFieldsValue(inittial());
    }
  }, [form, stateCouponDetail, isModalOpen]);

  useEffect(() => {
    if (rowSelected && OpenDrawer) {
      setIsLoaddingUpdate(true);
      fetchGetDetailsCoupon(rowSelected);
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
  };

  const getAllCoupons = async () => {
    const res = await CouponService.getAllCoupons();
    return res;
  };

  const { data, isSuccess, isError } = mutation;

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

  console.log("dataUpdated", dataUpdated);

  const queryCoupon = useQuery({
    queryKey: ["coupons"],
    queryFn: getAllCoupons,
  });

  const { isLoading: isLoadingCoupons, data: coupons } = queryCoupon;

  const columns = [
    {
      title: "Tên coupon",
      dataIndex: "name",
      width: "20%",
      responsive: ["lg"],
    },
    {
      title: "Giảm giá (%)",
      dataIndex: "discount",
      width: "20%",
      responsive: ["md"],
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      width: "25%",
      responsive: ["lg"],
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
      width: "25%",
      responsive: ["lg"],
      render: (text) => moment(text).format("DD/MM/YYYY"),
    },
    {
      title: "Chức năng",
      dataIndex: "Action",
      width: "10%",
      responsive: ["md"],
      render: () => (
        <div>
          <EditOutlined
            onClick={showDrawer}
            style={{ color: "orange", fontSize: "30px", cursor: "pointer" }}
          />
          <DeleteOutlined
            onClick={() => setIsModalOpen(true)}
            style={{ color: "red", fontSize: "30px", cursor: "pointer" }}
          />
        </div>
      ),
    },
  ];

  const dataTable = coupons?.data?.map((coupon) => ({
    ...coupon,
    key: coupon._id,
  }));

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setStateCouponDetail({
      name: "",
      discount: "",
      startDate: "",
      endDate: "",
    });
    form.resetFields();
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Cập nhật thông tin thành công !");
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error("Đã xảy ra lỗi khi cập nhật thông tin !!!");
    }
  }, [isSuccessUpdated, isErrorUpdated]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleCreateCoupon = () => {
    mutation.mutate(null, {
      onSettled: () => {
        queryCoupon.refetch();
        message.success("Tạo coupon thành công");
      },
      onError: (error) => {
        message.error("Lỗi khi tạo coupon: " + error.message);
      },
    });
  };

  const handleDeleteCoupon = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryCoupon.refetch();
          setIsModalOpen(false); // Đóng modal sau khi xóa
          message.success("Xóa coupon thành công!");
        },
        onError: (error) => {
          message.error("Lỗi khi xóa coupon: " + error.message);
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateCoupon({
      name: "",
      discount: "",
      startDate: "",
      endDate: "",
    });
    form.resetFields();
  };

  const hanleOnChangeDetail = (e) => {
    setStateCouponDetail({
      ...stateCouponDetail,
      [e.target.name]: e.target.value,
    });
  };

  const onUpdateCoupon = () => {
    mutationUpdate.mutate(
      { id: rowSelected, token: user?.access_token, ...stateCouponDetail },
      {
        onSettled: () => {
          queryCoupon.refetch();
        },
      }
    );
  };

  return (
    <LoadingComponent isLoading={isLoadingCoupons}>
      <Layout>
        <SiderComponent collapsed={collapsed} user={user} selectKey={"5"} />
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
              QUẢN LÝ GIẢM GIÁ
            </h5>
            <Button
              type="text"
              icon={
                <PlusCircleOutlined
                  style={{ fontSize: "26px", color: "green" }}
                />
              }
              className="btn btn-default"
              onClick={handleCreateCoupon}
              style={{
                width: 64,
                height: 64,
                float: "right",
                marginRight: 80,
              }}
            />
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
                title="Cập nhật coupon"
                onCancel={onClose}
                open={OpenDrawer}
                loading={loadingDrawer}
                width="60%"
                style={{
                  top: 80,
                }}
                footer={null}
              >
                <Form
                  name="basic"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                  onFinish={onUpdateCoupon}
                  autoComplete="on"
                  form={form}
                >
                  <Form.Item
                    label="Tên coupon"
                    name="name"
                    rules={[
                      { required: true, message: "Hãy nhập tên coupon!" },
                    ]}
                  >
                    <InputComponent
                      value={stateCouponDetail.name}
                      onChange={hanleOnChangeDetail}
                      name="name"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Giảm giá (%)"
                    name="discount"
                    rules={[{ required: true, message: "Hãy nhập giảm giá!" }]}
                  >
                    <InputNumber
                      min={1}
                      max={50}
                      value={stateCouponDetail.discount}
                      onChange={(value) =>
                        hanleOnChangeDetail({
                          target: { name: "discount", value },
                        })
                      }
                      name="discount"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Ngày bắt đầu"
                    name="startDate"
                    rules={[
                      { required: true, message: "Hãy nhập ngày bắt đầu!" },
                    ]}
                  >
                    <DatePicker
                      value={
                        stateCouponDetail.startDate
                          ? moment(stateCouponDetail.startDate)
                          : null
                      }
                      onChange={(date) =>
                        hanleOnChangeDetail({
                          target: { name: "startDate", value: date },
                        })
                      }
                      name="startDate"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    label="Ngày kết thúc"
                    name="endDate"
                    rules={[
                      { required: true, message: "Hãy nhập ngày kết thúc!" },
                    ]}
                  >
                    <DatePicker
                      value={
                        stateCouponDetail.endDate
                          ? moment(stateCouponDetail.endDate)
                          : null
                      }
                      onChange={(date) =>
                        hanleOnChangeDetail({
                          target: { name: "endDate", value: date },
                        })
                      }
                      name="endDate"
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item wrapperCol={{ offset: 20, span: 20 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ width: "90%" }}
                    >
                      Apply
                    </Button>
                  </Form.Item>
                </Form>
              </ModalComponent>

              <Modal
                title="Xóa coupon"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleDeleteCoupon}
              >
                <div>Bạn có chắc xóa coupon này không?</div>
              </Modal>

              <TableComponent
                columns={columns}
                dataSource={dataTable}
                loading={isLoadingCoupons}
                pagination={{ position: ["bottomCenter"], pageSize: 7 }}
                onRow={(record) => ({
                  onClick: () => {
                    setRowSelected(record._id);
                  },
                })}
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </LoadingComponent>
  );
};

export default CouponAdmin;
