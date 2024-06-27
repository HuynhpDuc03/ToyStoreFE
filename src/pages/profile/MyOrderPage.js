import { SmileOutlined, TruckOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, List, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import VnProvinces from "vn-local-plus";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { converPrice } from "../../utils";
import { orderContant } from "../../contant";
import { useMutationHooks } from "../../hooks/useMutationHook";
import LoadingComponent from "../../components/LoadingComponent/LoadingCompoent";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  };

  const { isLoading, data } = useQuery({
    queryKey: ["order", state?.id],
    queryFn: fetchMyOrder,
    enabled: !!(state?.id && state?.token),
  });
  const handleDetailsProduct = (id) => {
    navigate(`/productsDetail/${id}`);
  };
  const renderProduct = (products) => {
    return products?.map((product, index) => (
      <List.Item key={index}>
        <List.Item.Meta
          avatar={
            <Avatar
              size={80}
              src={require(`../../img/product/${product?.image[0]}`)}
            />
          }
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
          description={"Đồ chơi siêu trí tuệ"}
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
  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        userid: state?.id,
        token: state?.token,
        name: state?.name,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems } = data;
    const res = OrderService.cancelOrder(id, token, orderItems);
    return res.data;
  });
  const handleCancelOrder = (order) => {
    mutation.mutate(
      { id: order?._id, token: state?.token, orderItems: order?.orderItems },
      {
        onSuccess: () => {
          queryClient.refetchQueries(["order", state?.id]);
          setTimeout(() => {
            setConfirmLoading(false);
            setOpen(false);
          }, 1000); // Delay closing the modal for 1 second
        },
        onError: () => {
          setConfirmLoading(false); // Stop the loading state of the modal even if there's an error
        },
      }
    );
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Vui lòng xác nhận hủy đơn hàng!");
  const [currentOrder, setCurrentOrder] = useState(null);

  const showModal = (order) => {
    setCurrentOrder(order);
    setOpen(true);
  };
  const handleOk = () => {
    setModalText("Vui lòng xác nhận hủy đơn hàng!");
    setConfirmLoading(true);
    handleCancelOrder(currentOrder);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="container pt-5" style={{ marginBottom: 200 }}>
      <div className="row">
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          ĐƠN HÀNG CỦA BẠN
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
                    <Link style={{ color: "#000" }}>
                      <TruckOutlined /> Thông tin đơn hàng
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-9 col-sm-9 col-md-9 ">
          {isLoading ? (
            <LoadingComponent isLoading={isLoading} />
          ) : Array.isArray(data) ? (
            data.map((order) => (
              <div className="card border-1 mt-3" key={order?._id}>
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#c3d2bd",
                    padding: "8px",
                  }}
                >
                  Ngày đặt: <span>{formatDate(order?.createdAt)} </span>| Thanh
                  toán:{" "}
                  <span>{orderContant.payment[order?.paymentMethod]}</span> |{" "}
                  Giao hàng: <span>chờ giao hàng</span>
                </div>

                <div
                  className="card-body"
                  style={{ paddingTop: "10px", paddingBottom: "10px" }}
                >
                  <List itemLayout="horizontal">
                    {renderProduct(order?.orderItems)}
                  </List>
                </div>
                <hr style={{ marginTop: "0px" }} />
                <div className="card-body" style={{ paddingTop: "0px" }}>
                  <span style={{ float: "right", fontSize: "18px" }}>
                    Tổng tiền:{" "}
                    <span style={{ color: "#e53637", fontWeight: "700" }}>
                      {converPrice(order?.totalPrice)}
                    </span>
                  </span>
                  <div>
                    <Button
                      danger
                      onClick={() => showModal(order)}
                      style={{ marginRight: "10px" }}
                    >
                      Hủy đơn hàng
                    </Button>
                    <Modal
                      title="Bạn có chắc muốn hủy đơn hàng ?"
                      open={open}
                      mask={false}
                      onOk={handleOk}
                      confirmLoading={confirmLoading}
                      onCancel={handleCancel}
                    >
                      <p>{modalText}</p>
                    </Modal>
                    <Button onClick={() => handleDetailsOrder(order?._id)}>
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div>No orders found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
