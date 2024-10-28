import { TruckOutlined, UserOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Empty,
  List,
  Menu,
  Pagination,
  Tabs,
  Skeleton,
  Modal,
  Rate,
  Checkbox,
  Input,
} from "antd";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { converPrice } from "../../utils";
import { Contant } from "../../contant";
import { useTranslation } from "react-i18next";

const MyOrderPage = () => {
  const { t } = useTranslation();
  const orderContant = Contant(t);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    page: 0,
    limit: 8,
    total: 1,
  });
  const [activeTab, setActiveTab] = useState("0");

  const fetchMyOrder = async (page, limit, status) => {
    const res = await OrderService.getOrderByUserId(
      state?.id,
      state?.token,
      page,
      limit,
      status
    );
    setPagination((prevPagination) => ({
      ...prevPagination,
      total: res?.total,
    }));
    return res.data;
  };

  const { isLoading, data } = useQuery({
    queryKey: [
      "order",
      state?.id,
      pagination.page,
      pagination.limit,
      activeTab,
    ],
    queryFn: () => fetchMyOrder(pagination.page, pagination.limit, activeTab),
    enabled: !!(state?.id && state?.token),
  });

  const handleDetailsProduct = (id) => {
    navigate(`/productsDetail/${id}`);
  };

  const renderProduct = (products) => {
    return products?.map((product, index) => (
      <List.Item key={index}>
        <List.Item.Meta
          avatar={<Avatar shape="square" size={80} src={product?.image[0]} />}
          title={
            <Link
              onClick={(e) => {
                e.preventDefault();
                handleDetailsProduct(product?.product);
              }}
            >
              {product.name}
            </Link>
          }
          description={""}
        />
        <p>{`${product.amount} x  ${converPrice(product.price)}`}</p>
      </List.Item>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCancelOrder = (order) => {
    // Xử lý hủy đơn hàng
  };

  const onChangePage = (current, pagesize) => {
    setPagination({ page: current - 1, limit: pagesize });
  };

  const handleClickNavigate = () => {
    navigate("/profile-user");
  };

  const handleClickOrderDetail = (id) => {
    navigate(`/details-order/${id}`);
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
          onClick: handleClickNavigate,
        },
        {
          key: "2",
          label: (
            <span>
              <TruckOutlined /> {t("pageProfile.orderInfo")}
            </span>
          ),
        },
      ],
    },
  ];

  const tabsItems = [
    { key: "0", label: t("pageProfile.allOrders") },
    { key: "1", label: t("pageProfile.pendingOrders") },
    { key: "2", label: t("pageProfile.confirmedOrders") },
    { key: "3", label: t("pageProfile.shippingOrders") },
    { key: "4", label: t("pageProfile.deliveredOrders") },
    { key: "5", label: t("pageProfile.canceledOrders") },
  ];

  const [openUpdate, setOpenUpdate] = useState(false);
  const [confirmLoadingUpdate, setConfirmLoadingUpdate] = useState(false);
  const [currentOrderUpdate, setCurrentOrderUpdate] = useState(null);

  const [modalTextUpdate, setModalTextUpdate] = useState(
    "Vui lòng xác nhận đã nhận được hàng"
  );
  const showModalUpdate = (order) => {
    setOpenUpdate(true);
    setCurrentOrderUpdate(order);
  };
  const handleOkUpdate = (order) => {
    setModalTextUpdate("Đang xác nhận đơn hàng vui lòng chờ trong giây lát !");
    setConfirmLoadingUpdate(true);
    OrderService.markOrderAsReceived(
      { orderId: currentOrderUpdate?._id, isPaid: true, isDelivered: true },
      state?.token
    )
      .then(() => {
        QueryClient.refetchQueries(["order", state?.id]); // Làm mới dữ liệu đơn hàng
        setOpenUpdate(false);
        setConfirmLoadingUpdate(false);
      })
      .catch(() => {
        setConfirmLoadingUpdate(false);
      });
  };
  const handleCancelUpdate = () => {
    setOpenUpdate(false);
  };

  const [openRate, setOpenRate] = useState(false);
  const showModalRate = (order) => {
    setOpenRate(true);
    // setCurrentOrderUpdate(order);
  };


  const [rating, setRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [shippingRating, setShippingRating] = useState(5);
  const [showUsername, setShowUsername] = useState(true);
  
  const handleSubmit = () => {
    // Handle form submit logic here
    setOpenRate(false);
  };


  return (
    <div className="container" style={{ marginBottom: 200 }}>
      <div className="row">
        <div className="col-2 col-sm-2 col-md-2">
          <Menu
            style={{
              width: "100%",
            }}
            defaultSelectedKeys={"2"}
            mode="inline"
            items={items}
          />
        </div>
        <div className="col-10 col-sm-10 col-md-10 ">
          <Tabs
            size="large"
            type="card"
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key)}
            tabBarStyle={{ width: "100%" }}
            items={tabsItems.map((tab) => ({
              key: tab.key,
              label: (
                <div style={{ width: "122px", textAlign: "center" }}>
                  {tab.label}
                </div>
              ),
            }))}
          />
          {isLoading ? (
            <>
              <Skeleton active avatar paragraph={{ rows: 1 }} />
              <Skeleton active avatar paragraph={{ rows: 1 }} />
              <Skeleton active avatar paragraph={{ rows: 1 }} />
              <Skeleton active avatar paragraph={{ rows: 1 }} />
              <Skeleton active avatar paragraph={{ rows: 1 }} />
            </>
          ) : Array.isArray(data) && data.length > 0 ? (
            data.map((order) => (
              <div className="card border-1 mt-3" key={order?._id}>
                <div
                  style={{
                    width: "100%",
                    borderBottom: "2px solid #ccc",
                    padding: "8px",
                  }}
                >
                  {t("pageProfile.orderDate")}:{" "}
                  <span>{formatDate(order?.createdAt)} </span>|{" "}
                  {t("pageProfile.payment")}:{" "}
                  <span>{orderContant.payment[order?.paymentMethod]}</span>
                  <span
                    style={{
                      fontSize: "18px",
                      color: orderContant.status[order?.orderStatus]?.color,
                      backgroundColor:
                        orderContant.status[order?.orderStatus]
                          ?.backgroundColor,
                      borderRadius: "5px",
                      padding: "5px",
                      float: "right",
                    }}
                  >
                    {orderContant.status[order?.orderStatus]?.label}
                  </span>
                </div>

                <div className="card-body">
                  <List itemLayout="horizontal">
                    {renderProduct(order?.orderItems)}
                  </List>
                </div>
                <div className="card-footer">
                  <span style={{ float: "right", fontSize: "18px" }}>
                    {t("pageCheckOut.orderTotal")}:{" "}
                    <span style={{ color: "#e53637", fontWeight: "700" }}>
                      {converPrice(order?.totalPrice)}
                    </span>
                  </span>
                  {order?.orderStatus === "1" ? (
                    <Button
                      disabled={order?.orderStatus !== "1"}
                      danger
                      onClick={() => handleCancelOrder(order)}
                    >
                      {t("pageProfile.btnCancel")}
                    </Button>
                  ) : (
                    <></>
                  )}{" "}
                  <Button onClick={() => handleClickOrderDetail(order?._id)}>
                    {t("pageProfile.seeDetails")}
                  </Button>
                  {order?.orderStatus === "4" ? (
                    <>
                      <Button
                        type="primary"
                        onClick={() => showModalUpdate(order)}
                        style={{ float: "right", marginRight: "16px" }}
                        disabled={order?.isPaid && order?.isDelivered}
                      >
                        Đã nhận được hàng
                      </Button>

                      {order?.isPaid === true && order?.isDelivered === true ? (
                        <Button
                          type="primary"
                          onClick={() => showModalRate(order)}
                          style={{ float: "right", marginRight: "16px" }}
                        >
                          Đánh giá
                        </Button>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  <Modal
                    title="Xác nhận đơn hàng"
                    open={openUpdate}
                    onOk={handleOkUpdate}
                    mask={false}
                    confirmLoading={confirmLoadingUpdate}
                    onCancel={handleCancelUpdate}
                  >
                    <p>{modalTextUpdate}</p>
                  </Modal>
                  <Modal
                    title="Đánh giá sản phẩm"
                    open={openRate}
                    okText={"Xác nhận"}
                    mask={false}
                    cancelText={"Hủy bỏ"}
                    maskClosable={false}
                    onOk={() => handleSubmit()}
                    onCancel={() => setOpenRate(false)}
                    width={730}
                  >
                    <div className="container">
                      <div className="row mb-2">
                        <div className="col-12 text-center">
                          <h5>Áo sơ mi nam dài tay KJ chất vải lụa thái</h5>
                          <p>Phân loại hàng: Đen, Size-XXL</p>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-12">
                          <strong>Chất lượng sản phẩm</strong>
                          <Rate
                            allowHalf
                            defaultValue={rating}
                            onChange={setRating}
                          />
             
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-12">
                          <Input.TextArea
                            rows={4}
                            placeholder="Hãy chia sẻ về sản phẩm..."
                          />
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-6">
                          <Button
                            className="w-100"
                            type="dashed"
                            icon={<i className="fa fa-camera" />}
                          >
                            Thêm Hình Ảnh
                          </Button>
                        </div>
                        <div className="col-6">
                          <Button
                            className="w-100"
                            type="dashed"
                            icon={<i className="fa fa-video-camera" />}
                          >
                            Thêm Video
                          </Button>
                        </div>
                      </div>

                      <div className="row mb-3">
                        <div className="col-12">
                          <Checkbox
                            checked={showUsername}
                            onChange={(e) => setShowUsername(e.target.checked)}
                          >
                            Hiển thị tên đăng nhập trên đánh giá này
                          </Checkbox>
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-12">
                          <strong>Dịch vụ của người bán</strong>
                          <Rate
                            allowHalf
                            defaultValue={serviceRating}
                            onChange={setServiceRating}
                          />
                          <span className="ml-2">Tuyệt vời</span>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col-12">
                          <strong>Dịch vụ vận chuyển</strong>
                          <Rate
                            allowHalf
                            defaultValue={shippingRating}
                            onChange={setShippingRating}
                          />
                          <span className="ml-2">Tuyệt vời</span>
                        </div>
                      </div>
                    </div>
                  </Modal>
                </div>
              </div>
            ))
          ) : (
            <Empty className="mt-5" description={t("pageProfile.notFound")} />
          )}

          <Pagination
            className="mt-3"
            align="center"
            defaultCurrent={pagination.page + 1}
            total={pagination.total}
            onChange={onChangePage}
            showTotal={(total) =>
              `${t("pagination.total")} ${total} ${t("pagination.items")}`
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
