import { Avatar, List } from "antd";
import React, { useEffect, useState } from "react";
import { orderContant } from "../../contant";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  SmileOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import VnProvinces from "vn-local-plus";
import { converPrice } from "../../utils";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";

const DetailsOrderPage = () => {
  const params = useParams();
  const location = useLocation();
  const { state } = location;
  const { id } = params;
  console.log("id", params);
  const navigate = useNavigate();
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  const fetchGetDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, state?.token);
    return res.data;
  };

  const { isLoading, data: orderDetails } = useQuery({
    queryKey: ["order", id],
    queryFn: fetchGetDetailsOrder,
    enabled: !!id,
  });
  
  console.log("orderDetails",orderDetails)

  useEffect(() => {
    if (orderDetails?.shippingAddress) {
      const { city, district, ward } = orderDetails.shippingAddress;

      const fetchLocationData = async () => {
        const province = VnProvinces.getProvinceByCode(city);
        setProvinceName(province?.name || "");

        const districtData = VnProvinces.getDistrictByCode(district);
        setDistrictName(districtData?.name || "");

        const wardData = VnProvinces.getWardByCode(ward);
        setWardName(wardData?.name || "");
      };

      fetchLocationData();
    }
  }, [orderDetails]);

  const handleClickNavigate = () => {
    navigate("/my-order", {
      state: {
        id: state?.userid,
        token: state?.token,
      },
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <LoadingComponent isLoading={isLoading}>
    <div className="container pt-5" style={{ marginBottom: 200 }}>
      
        <div className="row">
          <h2
            style={{
              textAlign: "center",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            CHI TIẾT ĐƠN HÀNG
          </h2>

          <div className="col-3 col-sm-3 col-md-3">
            <div
              className="card border-0 shadow mt-3"
              style={{ borderRadius: "5px" }}
            >
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
                  <SmileOutlined /> Thông tin của bạn
                </p>
              </div>
              <div className="card-body">
                <div className="shop__sidebar__categories">
                  <ul>
                    <li>
                      <Link to={"/profile-user"}>
                        <UserOutlined /> Tài khoản
                      </Link>
                    </li>
                    <li>
                      <Link
                        onClick={(e) => {
                          e.preventDefault();
                          handleClickNavigate();
                        }}
                        style={{ color: "#000" }}
                      >
                        <TruckOutlined /> Thông tin đơn hàng
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="col-9 col-sm-9 col-md-9 ">
       
            <div className="card border-1 mt-3">
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#c3d2bd",
                  padding: "8px",
                }}
              >
                Mã đơn hàng: <span>{orderDetails?._id}</span> | Ngày đặt:{" "}
                <span>{formatDate(orderDetails?.createdAt)} </span> |{" "}
                {orderContant.payment[orderDetails?.paymentMethod]}:
                <span>
                  {" "}
                  {orderDetails?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </span>{" "}
                | Giao hàng:{" "}
                <span>
                  {orderDetails?.isDelivered ? "Đã giao hàng" : "Chờ giao hàng"}
                </span>
              </div>

              <div
                className="card-body"
                style={{ paddingTop: "10px", paddingBottom: "10px" }}
              >
                {orderDetails?.orderItems?.map((orderItem, index) => {
                  return (
                    <List
                      key={orderItem._id}
                      itemLayout="horizontal"
                      dataSource={[orderItem]}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <Avatar
                                size={80}
                                src={require(`../../img/product/${item?.image}`)}
                              />
                            }
                            title={<a href="https://ant.design">{item.name}</a>}
                            description={"Đồ chơi siêu trí tuệ"}
                          />
                          <p>{`${item.amount} x  ${converPrice(
                            item.price
                          )}`}</p>
                        </List.Item>
                      )}
                    />
                  );
                })}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="card border-1 mt-3">
                  <div className="card-body">
                    <h5>Thông tin địa chỉ</h5>
                    <hr style={{ height: "0px" }} />
                    <span
                      style={{ fontSize: "14px", textTransform: "capitalize" }}
                    >
                      <UserOutlined /> {orderDetails?.shippingAddress?.fullName}{" "}
                      - <PhoneOutlined /> {orderDetails?.shippingAddress?.phone}
                    </span>
                    <div style={{ fontSize: "14px" }}>
                      <EnvironmentOutlined />{" "}
                      {orderDetails?.shippingAddress?.address}, {wardName},{" "}
                      {districtName}, {provinceName}
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card border-1 mt-3">
                  <div className="card-body">
                    <h5 style={{ paddingBottom: "10px" }}>Tóm tắt tổng tiền</h5>
                    <div>
                      <ul className="checkout__total__all">
                        <li>
                          Tạm tính{" "}
                          <span>{converPrice(orderDetails?.itemsPrice)}</span>
                        </li>
                        <li>
                          Giảm giá{" "}
                          <span>
                            {!orderDetails?.discountPrice
                              ? converPrice(0)
                              : converPrice(orderDetails?.discountPrice)}
                          </span>
                        </li>
                        <li>
                          Phí vận chuyển{" "}
                          <span>
                            {converPrice(orderDetails?.shippingPrice)}
                          </span>
                        </li>
                      </ul>
                      <span>
                        Tổng tiền{" "}
                        <span
                          style={{
                            float: "right",
                            color: "#e53637",
                            fontWeight: "700",
                          }}
                        >
                          {converPrice(orderDetails?.totalPrice)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
    
        </div>
     
    </div>
    </LoadingComponent>
  );
};

export default DetailsOrderPage;
