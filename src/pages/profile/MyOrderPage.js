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
import { addReview } from "../../services/ProductService";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import { converPrice } from "../../utils";
import { Contant } from "../../contant";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const MyOrderPage = () => {
  const user = useSelector((state) => state?.user);
  const { t } = useTranslation();
  const orderContant = Contant(t);
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
          avatar={<Avatar shape="square" size={80} src={product?.image} />}
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
    Modal.confirm({
      title: t("pageProfile.confirmCancelOrder"),
      content: t("pageProfile.cancelOrder"),
      onOk: async () => {
        try {
          await OrderService.cancelOrder(
            order._id,
            state?.token,
            order.orderItems
          );
          queryClient.invalidateQueries([
            "order",
            state?.id,
            pagination.page,
            pagination.limit,
            activeTab,
          ]);
        } catch (error) {
          console.error(error);
        }
      },
    });
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
  const handleOkUpdate = async () => {
    setConfirmLoadingUpdate(true);
    try {
      await OrderService.markOrderAsReceived(
        { orderId: currentOrderUpdate?._id, isPaid: true, isDelivered: true },
        state?.token
      );
      queryClient.invalidateQueries([
        "order",
        state?.id,
        pagination.page,
        pagination.limit,
        activeTab,
      ]);

      setOpenUpdate(false);
    } catch (error) {
      console.error(error);
    } finally {
      setConfirmLoadingUpdate(false);
    }
  };

  const handleCancelUpdate = () => {
    setOpenUpdate(false);
  };

  const [openRate, setOpenRate] = useState(false);
  const [ratingData, setRatingData] = useState({});
  const [orderItemsForRating, setOrderItemsForRating] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState([]);

  // Function to open rating modal with items
  const showModalRate = (orderId, orderItems) => {
    setOrderItemsForRating(orderItems); // set products to rate
    setCurrentOrderId(orderId); // lưu lại OrderID
    setOpenRate(true);
  };
  const handleSubmitRating = async () => {
    try {
      for (const item of orderItemsForRating) {
        const productRating = ratingData[item.product];
        if (productRating) {
          const { rating, comment, image } = productRating;
          await addReview(
            {
              orderId: currentOrderId,
              product: item.product,
              user: user.id,
              rating,
              comment,
              image,
            },
            user?.access_token // assuming token is available
          );
        }
      }
      setOpenRate(false); // Đóng modal sau khi gửi
      queryClient.invalidateQueries(["order", state?.id]); // Cập nhật lại dữ liệu order
    } catch (error) {
      console.error("Failed to submit review:", error);
    }
  };

  // Function to handle rating and comment changes
  const handleRatingChange = (productId, value) => {
    setRatingData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], rating: value },
    }));
  };

  const handleCommentChange = (productId, event) => {
    const { value } = event.target;
    setRatingData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], comment: value },
    }));
  };

  const handleImageChange = (productId, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        setRatingData((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], image: base64String },
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCloseModal = () => {
    setOpenRate(false);
    setRatingData({}); // Xóa dữ liệu đánh giá
    setOrderItemsForRating([]); // Xóa dữ liệu sản phẩm
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
                  {order?.orderStatus === "4" && (
                    <>
                      <Button
                        type="primary"
                        onClick={() => showModalUpdate(order)}
                        style={{ float: "right", marginRight: "16px" }}
                        disabled={order?.isPaid && order?.isDelivered}
                      >
                        Đã nhận được hàng
                      </Button>

                      {order?.isPaid === true &&
                      order?.isDelivered === true &&
                      order?.orderItems.some((item) => !item.isRating) ? (
                        <Button
                          type="primary"
                          onClick={() =>
                            showModalRate(
                              order._id,
                              order.orderItems.filter((item) => !item.isRating)
                            )
                          }
                          style={{ float: "right", marginRight: "16px" }}
                        >
                          Đánh giá
                        </Button>
                      ) : null}
                    </>
                  )}
                  <Modal
                    title="Xác nhận đơn hàng"
                    open={openUpdate}
                    onOk={handleOkUpdate}
                    confirmLoading={confirmLoadingUpdate}
                    onCancel={handleCancelUpdate}
                  >
                    <p>{modalTextUpdate}</p>
                  </Modal>
                  <Modal
                    title="Đánh giá sản phẩm"
                    open={openRate}
                    okText="Xác nhận"
                    cancelText="Hủy bỏ"
                    maskClosable={false}
                    onOk={handleSubmitRating}
                    onCancel={handleCloseModal}
                    width={730}
                  >
                    <div className="container">
                      {orderItemsForRating.map((item) => (
                        <div key={item.product}>
                          <div className="row mb-2">
                            <div className="col-12 d-flex align-items-center">
                              <img
                                src={item.image}
                                alt="Ảnh sản phẩm"
                                style={{
                                  width: "100px",
                                  height: "100px",
                                  marginRight: "15px",
                                  borderRadius: "8px",
                                }}
                              />
                              <div>
                                <h5>{item.name}</h5>
                                <p>Phân loại hàng: Đồ chơi</p>
                              </div>
                            </div>
                          </div>

                          <div className="row mb-2">
                            <div className="col-12">
                              <strong>Chất lượng sản phẩm</strong>
                              <Rate
                                defaultValue={
                                  ratingData[item.product]?.rating || 0
                                }
                                onChange={(value) =>
                                  handleRatingChange(item.product, value)
                                }
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-12">
                              <Input.TextArea
                                rows={4}
                                placeholder="Hãy chia sẻ về sản phẩm..."
                                value={ratingData[item.product]?.comment || ""}
                                onChange={(e) =>
                                  handleCommentChange(item.product, e)
                                }
                              />
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-12">
                              <Button
                                className="w-100"
                                type="dashed"
                                icon={<i className="fa fa-camera" />}
                                onClick={() =>
                                  document
                                    .getElementById(`fileInput-${item.product}`)
                                    .click()
                                }
                              >
                                Thêm Hình Ảnh
                              </Button>
                              <input
                                id={`fileInput-${item.product}`}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  handleImageChange(item.product, e)
                                }
                              />
                            </div>
                          </div>

                          {ratingData[item.product]?.image && (
                            <div className="row mb-3">
                              <div className="col-12">
                                <img
                                  src={ratingData[item.product].image}
                                  alt="Ảnh đã chọn"
                                  style={{
                                    width: "150px",
                                    borderRadius: "8px",
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          <hr />
                        </div>
                      ))}
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
