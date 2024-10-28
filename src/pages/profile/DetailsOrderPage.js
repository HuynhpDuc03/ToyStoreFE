import { Avatar, List, Menu, Skeleton, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { Contant } from "../../contant";
import {
  EnvironmentOutlined,
  FileProtectOutlined,
  InboxOutlined,
  PhoneOutlined,
  SmileOutlined,
  SolutionOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import VnProvinces from "vn-local-plus";
import { converPrice } from "../../utils";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";
import StepComponent from "../../components/StepComponent/StepComponent";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const DetailsOrderPage = () => {
  const params = useParams();
  const user = useSelector((state) => state?.user);
  const { t } = useTranslation();
  const orderContant = Contant(t);
  const location = useLocation();
  const { state } = location;
  const { id } = params;
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
        id: user?.id,
        token: user?.access_token,
      },
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const itemsStatus = [
    {
      title: t("pageProfile.orderPlaced"),
      icon: <SolutionOutlined />,
    },
    {
      title: t("pageProfile.confirmed"),
      icon: <FileProtectOutlined />,
    },
    {
      title: t("pageProfile.shipping"),
      icon: <TruckOutlined />,
    },
    {
      title: t("pageProfile.received"),
      icon: <InboxOutlined />,
    },
  ];

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
          onClick: () => navigate("/profile-user"),
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
              borderRadius: "8px",
            }}
            defaultSelectedKeys={"2"}
            mode="inline"
            items={items}
          />
        </div>
        <div className="col-10 col-sm-10 col-md-10">
          {isLoading ? (
            <>
              <Skeleton active avatar paragraph={{ rows: 1 }} />
              <Skeleton active avatar paragraph={{ rows: 1 }} />
              <Skeleton active avatar paragraph={{ rows: 1 }} />
              <Skeleton active avatar paragraph={{ rows: 1 }} />
              <Skeleton active avatar paragraph={{ rows: 1 }} />
            </>
          ) : (
            <>
              <StepComponent
                items={itemsStatus}
                curent={orderDetails?.orderStatus}
              />

              <div
                className="card border-1 mt-3 shadow-sm"
                style={{ borderRadius: "8px" }}
              >
                <div
                  style={{
                    width: "100%",
                    borderBottom: "2px solid #f0f0f0",
                    padding: "10px",
                    fontWeight: "500",
                    backgroundColor: "#fafafa",
                    color: "#555",
                    borderTopLeftRadius: "8px",
                    borderTopRightRadius: "8px",
                  }}
                >
                  {t("pageProfile.orderID")}: <span>{orderDetails?._id}</span> |{" "}
                  {t("pageProfile.orderDate")}:{" "}
                  <span>{formatDate(orderDetails?.createdAt)} </span> |{" "}
                  {orderContant.payment[orderDetails?.paymentMethod]}:
                  <span>
                    {" "}
                    {orderDetails?.isPaid
                      ? t("pageProfile.paid")
                      : t("pageProfile.notPaid")}
                  </span>{" "}
                  | {t("pageProfile.delivery")}:{" "}
                  <span>
                    {orderDetails?.isDelivered
                      ? t("pageProfile.delivered")
                      : t("pageProfile.waitingForDelivery")}
                  </span>
                </div>

                <div className="card-body" style={{ padding: "10px" }}>
                  {orderDetails?.orderItems?.map((orderItem) => {
                    return (
                      <List
                        key={orderItem?.product}
                        itemLayout="horizontal"
                        dataSource={[orderItem]}
                        renderItem={(item) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <Avatar size={80} src={orderItem?.image[0]} />
                              }
                              title={
                                <Link
                                  to={`/productsDetail/${orderItem?.product}`}
                                >
                                  {item?.name}
                                </Link>
                              }
                            />
                            <p>{`${item?.amount} x  ${converPrice(
                              item?.price
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
                  <div
                    className="card border-1 mt-3 shadow-sm"
                    style={{ borderRadius: "8px" }}
                  >
                    <div className="card-body">
                      <h5>{t("pageProfile.infoAddress")}</h5>
                      <hr style={{ height: "0px" }} />
                      <span
                        style={{
                          fontSize: "14px",
                          textTransform: "capitalize",
                        }}
                      >
                        <UserOutlined />{" "}
                        {orderDetails?.shippingAddress?.fullName} -{" "}
                        <PhoneOutlined /> {orderDetails?.shippingAddress?.phone}
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
                  <div
                    className="card border-1 mt-3 shadow-sm"
                    style={{ borderRadius: "8px" }}
                  >
                    <div className="card-body">
                      <h5 style={{ paddingBottom: "10px" }}>
                        {t("pageProfile.summaryOfTotalAmount")}
                      </h5>
                      <div>
                        <ul className="checkout__total__all">
                          <li>
                            {t("pageCheckOut.temporary")}{" "}
                            <span>{converPrice(orderDetails?.itemsPrice)}</span>
                          </li>
                          <li>
                            {t("pageCheckOut.Discount")}{" "}
                            <span>
                              {!orderDetails?.discountPrice
                                ? converPrice(0)
                                : converPrice(orderDetails?.discountPrice)}
                            </span>
                          </li>
                          <li>
                            {t("pageCheckOut.ShippingFee")}{" "}
                            <span>
                              {converPrice(orderDetails?.shippingPrice)}
                            </span>
                          </li>
                        </ul>
                        <span>
                          {t("pageCheckOut.orderTotal")}{" "}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailsOrderPage;
