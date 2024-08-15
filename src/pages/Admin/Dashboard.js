import {
  ArrowRightOutlined,
  DollarCircleOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ProductFilled,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import * as OrderService from "../../services/OrderService";
import * as ProductService from "../../services/ProductService";

import React, { useState } from "react";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import { Button, Col, Layout, message, Row, Table, theme } from "antd";
import SiderComponent from "../../components/SiderComponent/SiderComponent";
import { useSelector } from "react-redux";
import "../../css/info-box.css";
import { converPrice, formatDate } from "../../utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PieChartPrice from "../../components/PieChartComponent/PieChartComponent";
import { orderContant } from "../../contant";
import * as UserService from "../../services/UserService";
import { useNavigate } from "react-router-dom";
import BarChartComponent from "../../components/BarChartComponent/BarChartComponent";

const Dashboard = () => {
  const user = useSelector((state) => state?.user);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [marginLeft, setMarginLeft] = useState(200);
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 200 : 80);
  };
  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder();
    return res;
  };
  const getAllUsers = async () => {
    const res = await UserService.getAllUSer();
    return res;
  };
  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    return res;
  };

  const queryUser = useQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });
  const queryProduct = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  const { data: users } = queryUser;
  const { data: products } = queryProduct;
  const { isLoading: isLoadingOrder, data: orders } = queryOrder;

  console.log("Order", orders);

  const dataTable = orders?.data
    ?.filter((order) => order.orderStatus === "1")
    .map((order) => ({
      key: order._id,
      name: order?.shippingAddress.fullName,
      product: `${order?.orderItems.length} ${"Sản phẩm"}`,
      status: orderContant.status[order?.orderStatus],
      createAt: formatDate(order?.createdAt),
    }));
    const handleClickNavigate = (id) => {
      navigate(`/AdminOrderDetails/${id}`);
    };
  const renderAction = (id) => {
    return (
      <Row gutter={8}>
        <Col>
          <Button  onClick={() => handleClickNavigate(id)}>Xem chi tiết</Button>
        </Col>
        <Col>
          <Button type="primary" onClick={() => updateOrderStatusHandler(id)}>
            Xác nhận
          </Button>
        </Col>
      </Row>
    );
  };
  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "createAt",
      key: "createAt",
    },
    {
      title: "Giỏ hàng",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Chức năng",
      dataIndex: "Action",
      render: (_, record) => renderAction(record.key),
    },
  ];

  const updateOrderStatusHandler = async (orderId) => {
    const status = "2";
    try {
      await OrderService.updateOrderStatus({ orderId, status }, user.token);
      queryClient.invalidateQueries("orders");
      message.success("Cập nhật thành công");
    } catch (error) {
      console.error("Failed to update order status", error);
    }
  };
  const totalRevenue = orders?.data
    ?.filter((order) => order.isPaid)
    ?.reduce((total, order) => total + order.totalPrice, 0);
  return (
    <LoadingComponent isLoading={isLoadingOrder}>
      <Layout>
        <SiderComponent collapsed={collapsed} user={user} selectKey={"1"} />
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
              DASHBOARD
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
            <Row gutter={14}>
              <Col span={6}>
                <div class="info-box">
                  <span class="info-box-icon bg-info">
                    <ShoppingCartOutlined />
                  </span>
                  <div class="info-box-content">
                    <span class="info-box-text" onClick={() => navigate("/AdminOrder")}>Đơn hàng</span>
                    <span class="info-box-number">{orders?.data?.length}</span>
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div class="info-box">
                  <span class="info-box-icon bg-success">
                    <DollarCircleOutlined />
                  </span>
                  <div class="info-box-content">
                    <span type="link" class="info-box-text" onClick={() => navigate("/AdminOrder")}>Doanh thu</span>
                    <span class="info-box-number">{converPrice(totalRevenue)}</span>
                  </div>
                  
                </div>
              </Col>
         
              <Col span={6}>
                <div class="info-box">
                  <span class="info-box-icon bg-indigo">
                    <ProductFilled />
                  </span>
                  <div class="info-box-content">
                    <span class="info-box-text" onClick={() => navigate("/AdminProduct")}>Sản phẩm</span>
                    <span class="info-box-number">{products?.data?.length}</span>
                  </div>
                </div>
              </Col>

              <Col span={6}>
                <div class="info-box">
                  <span class="info-box-icon bg-danger">
                    <UserOutlined />
                  </span>
                  <div class="info-box-content">
                    <span class="info-box-text"  onClick={() => navigate("/AdminUser")}>Người dùng</span>
                    <span class="info-box-number">{users?.data?.length}</span>
                  </div>
                </div>
              </Col>
            </Row>
            {orders?.data?.some((order) => order.orderStatus === "1") ? (
              <div
                className="p-4 mt-2"
                style={{
                  boxShadow:
                    "0 0 1px rgba(0, 0, 0, .125), 0 1px 3px rgba(0, 0, 0, .2)",
                  borderRadius: ".25rem",
                  backgroundColor: "#fff",
                }}
              >
                <h5>Đơn hàng cần xác nhận</h5>
                <Table
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                  className="mt-3"
                  bordered
                  dataSource={dataTable}
                  columns={columns}
                  pagination={{
                    position: ["bottomCenter"],
                    pageSize: 5,
                  }}
                />
                <div className="border-bottom">
                  <Button type="link" onClick={() => navigate("/AdminOrder")}>Xem tất cả đơn hàng </Button>
                </div>
              </div>
            ) : (
              <div></div>
            )}

            <Row gutter={8}>
              <Col span={14}>
                <div className="border p-4 mt-3">
                <h4 style={{textAlign:"center"}} className="mb-3">Thống kê doanh thu theo ngày trong tháng</h4>
                  <BarChartComponent token={user.access_token} />
                  </div>
              </Col>
              <Col span={10}>
                <div className="border p-4 mt-3">
                  <h4 style={{textAlign:"center"}}>Thống kê phương thức thanh toán</h4>
                  <PieChartPrice data={orders?.data} />
                </div>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </LoadingComponent>
  );
};

export default Dashboard;
