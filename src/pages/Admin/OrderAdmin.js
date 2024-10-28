import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { converPrice } from "../../utils";
import { Contant } from "../../contant";
//import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

import VnProvinces from "vn-local-plus";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import TableComponent from "../../components/TableComponent/TableComponent";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import { Button, Layout, theme } from "antd";
import SiderComponent from "../../components/SiderComponent/SiderComponent";
import { Content, Header } from "antd/es/layout/layout";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment/moment";
//import { formatTimeStr } from 'antd/es/statistic/utils';

const OrderAdmin = () => {
  const user = useSelector((state) => state?.user);
  const { t } = useTranslation();
  const orderContant = Contant(t);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [rowSelected, setRowSelected] = useState(false);

  const getAllOrder = async () => {
    const res = await OrderService.getAllOrder();
    return res;
  };

  const queryOrder = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrder,
  });

  const { isLoading: isLoadingOrder, data: orders } = queryOrder;

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        if (orders && orders.data && orders.data.length > 0) {
          const order = orders.data[0];
          const { city, district, ward } = order.shippingAddress;

          const provinceData = await VnProvinces.getProvinces();
          const userProvince = provinceData.find((prov) => prov.code === city);
          setProvince(userProvince?.name || "");

          if (city) {
            const districtData = await VnProvinces.getDistrictsByProvinceCode(
              city
            );
            const userDistrict = districtData.find(
              (dist) => dist.code === district
            );
            setDistrict(userDistrict?.name || "");
          }

          if (district) {
            const wardData = await VnProvinces.getWardsByDistrictCode(district);
            const userWard = wardData.find(
              (wardItem) => wardItem.code === ward
            );
            setWard(userWard?.name || "");
          }
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, [orders]);

  const navigate = useNavigate();

  const handleClickNavigate = (id) => {
    navigate(`/AdminOrderDetails/${id}`);
  };

  const renderAction = (id) => {
    return (
      <Button onClick={() => handleClickNavigate(id)}>Xem chi tiết</Button>
    );
  };

  const columns = [
    {
      title: "Tên Khách Hàng",
      dataIndex: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },

    {
      title: "Trạng Thái Thanh Toán",
      dataIndex: "paidStatus",
    },
    {
      title: "Trạng Thái Giao Hàng",
      dataIndex: "shipStatus",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
    },
    {
      title: "Chức năng",
      dataIndex: "Action",
      render: (_, record) => renderAction(record.key),
    },
  ];

  const dataTable = orders?.data?.map((order) => ({
    key: order._id,
    name: order?.shippingAddress.fullName,
    phone: order?.shippingAddress.phone,
    address: `${order.shippingAddress.address}, ${ward}, ${district}, ${province}`,
    paidStatus: order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán",
    orderStatus: (
      <span
        style={{
          fontSize: "18px",
          color: orderContant.status[order?.orderStatus]?.color,
          backgroundColor:
            orderContant.status[order?.orderStatus]?.backgroundColor,
          borderRadius: "5px",
          padding: "5px",
        }}
      >
        {orderContant.status[order?.orderStatus]?.label}
      </span>
    ),
    shipStatus: order?.isDelivered ? "Đã giao" : "Chưa giao",
    paymentMethod: orderContant.payment[order?.paymentMethod],
    orderDate: moment(order?.createdAt).format('DD/MM/yyyy'),
    total: converPrice(order?.totalPrice),
  }));

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [marginLeft, setMarginLeft] = useState(200);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 200 : 80);
  };
  return (
    <LoadingComponent isLoading={isLoadingOrder}>
      <Layout>
        <SiderComponent collapsed={collapsed} user={user} selectKey={"3"} />
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
              QUẢN LÝ ĐƠN HÀNG
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
            <TableComponent
              columns={columns}
              isLoading={isLoadingOrder}
              data={dataTable}
              pagination={{
                pageSize: 7,
                position: ["bottomCenter"], // Đặt nút phân trang ở giữa
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

export default OrderAdmin;
