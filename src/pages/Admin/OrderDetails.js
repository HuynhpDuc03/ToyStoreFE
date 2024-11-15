import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";

import React, { useEffect, useState } from "react";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import {
  Button,
  Col,
  Image,
  Layout,
  message,
  Row,
  Select,
  Table,
  theme,
} from "antd";
import SiderComponent from "../../components/SiderComponent/SiderComponent";
import { useSelector } from "react-redux";
import { converPrice, formatDate } from "../../utils";
import { useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import VnProvinces from "vn-local-plus";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { Contant } from "../../contant";
import { useTranslation } from "react-i18next";

const OrderDetails = () => {
  const user = useSelector((state) => state?.user);
  const { t } = useTranslation();
  const orderContant = Contant(t);
  const { id } = useParams();
  const [marginLeft, setMarginLeft] = useState(200);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const queryClient = useQueryClient();

  const fetchGetDetailsProduct = async () => {
    const res = await OrderService.getDetailsOrder(id);
    return res.data;
  };
  const queryOrder = useQuery({
    queryKey: ["product-details", id],
    queryFn: fetchGetDetailsProduct,
    enabled: !!id,
  });
  const { isLoading, data: orderDetails } = queryOrder;


  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 200 : 80);
  };
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        if (orderDetails) {
          const { city, district, ward } = orderDetails.shippingAddress;

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
  }, [orderDetails]);

  const dataSource = orderDetails?.orderItems.map((item, index) => ({
    key: index + 1,
    image: item.image,
    name: item.name,
    price: converPrice(item.price),
    quantity: item.amount,
    total: converPrice(item.price * item.amount),
  }));

  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      key: "image",
      render: (text) => <Image width={60} src={text} />,
    },
    {
      title: "Tên Sản Phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Số Lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thành Tiền",
      dataIndex: "total",
      key: "total",
    },
  ];

  const mutationUpdate = useMutationHooks(({ orderId, status }) => {
    const res = OrderService.updateOrderStatus(
      { orderId, status },
      user.access_token
    );

    return res;
  });

  const { isSuccess: isSuccessUpdated, isError: isErrorUpdated } =
    mutationUpdate;

  useEffect(() => {
    if (isSuccessUpdated) {
      message.success("Cập nhật thành công trạng thái đơn hàng!");
      queryClient.invalidateQueries(["product-details", id]);
    } else if (isErrorUpdated) {
      message.error("Cập nhật thất bại trạng thái đơn hàng!");
    }
  }, [isSuccessUpdated, isErrorUpdated, queryClient, id]);

  const handleStatusChange = (value) => {
    mutationUpdate.mutate({ orderId: id, status: value });
  };

  const Delivery = () => {
    if (orderDetails?.shippingPrice === 10000) {
      return (
        <>
          <span style={{ fontWeight: 700, color: "#ff7b02" }}>FAST</span> Giao
          hàng tiết kiệm
        </>
      );
    } else
      return (
        <>
          {" "}
          <span style={{ fontWeight: 700, color: "#ff7b02" }}>GO JEK</span> Giao
          hàng tiết kiệm
        </>
      );
  };

  return (
    <LoadingComponent isLoading={isLoading}>
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
            <Row>
              <Col span={8}>
                <h3>Thông tin đơn hàng</h3>
              </Col>
              <Col span={8} offset={8} style={{ textAlign: "right" }}>
                <span style={{ fontSize: "18px" }}>{orderDetails?._id}</span>{" "}
                <span
                  style={{
                    fontSize: "18px",
                    color:
                      orderContant.status[orderDetails?.orderStatus]?.color,
                    backgroundColor:
                      orderContant.status[orderDetails?.orderStatus]
                        ?.backgroundColor,
                    borderRadius: "5px",
                    padding: "5px",
                  }}
                >
                  {orderContant.status[orderDetails?.orderStatus]?.label}
                </span>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <h5>Thông tin khách hàng</h5>
                <h5 className="mt-3" style={{ textTransform: "capitalize" }}>
                  Họ và tên: {orderDetails?.shippingAddress?.fullName}
                </h5>
                <div className="mt-3">
                  Địa chỉ:{" "}
                  {`${orderDetails?.shippingAddress.address} , ${ward}, ${district}, ${province}`}
                </div>
                <div className="mt-3">
                  Số điện thoại: {orderDetails?.shippingAddress?.phone}
                </div>
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <h5>Phương thức thanh toán</h5>
                <div className="mt-3">
                  {orderContant.payment[orderDetails?.paymentMethod]}
                </div>
                <h5 className="mt-3">Phương thức vận chuyển</h5>
                <div className="mt-3"> {Delivery()}</div>
                <h5 className="mt-3">Ngày đặt hàng</h5>
                <div className="mt-3">
                  {formatDate(orderDetails?.createdAt)}
                </div>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <h4>Thay đổi trạng thái đơn hàng</h4>
                <Select
                  className="mt-3"
                  defaultValue={orderDetails?.orderStatus || "1"}
                  style={{ width: 306 }}
                  options={[
                    { value: "1", label: "Chờ xác nhận" },
                    { value: "2", label: "Đã xác nhận" },
                    { value: "3", label: "Đang vận chuyển" },
                    { value: "4", label: "Đã giao hàng" },
                    { value: "5", label: "Đã hủy" },
                  ]}
                  onChange={handleStatusChange}
                />
              </Col>
            </Row>

            <Row>
              <Col className="mt-3" span={24} style={{}}>
                <span style={{ fontSize: "18px", fontWeight: "400" }}>
                  Thông tin sản phẩm
                </span>
                <span style={{ float: "right" }}>
                  {orderDetails?.orderItems?.length} sản phẩm
                </span>
              </Col>
              <Col span={24}>
                <Table
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                  className="mt-3"
                  bordered
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                />
                <Col className="mt-3" span={12} offset={18}>
                  <span style={{ fontSize: "16px", color: "#111111" }}>
                    Tổng tiền:{" "}
                    <span
                      style={{
                        color: "#e53637",
                        fontWeight: "700",
                      }}
                    >
                      {converPrice(orderDetails?.totalPrice)}
                    </span>
                  </span>
                </Col>
                <hr />
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </LoadingComponent>
  );
};

export default OrderDetails;
