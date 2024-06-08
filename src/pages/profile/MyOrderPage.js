import { SmileOutlined, TruckOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, List } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as OrderService from "../../services/OrderService";
import VnProvinces from "vn-local-plus";
import { useQuery } from "@tanstack/react-query";
import { converPrice } from "../../utils";
import { orderContant } from "../../contant";
import { useMutationHooks } from "../../hooks/useMutationHook";

const MyOrderPage = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();

  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(state?.id, state?.token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["order"],
    queryFn: fetchMyOrder,
    enabled: !!(state?.id && state?.token),
  });

  const { data } = queryOrder;

  const renderProduct = (products) => {
    return products.map((product, index) => (
      <List.Item key={index}>
        <List.Item.Meta
          avatar={
            <Avatar
              size={80}
              src={require(`../../img/product/${product?.image}`)}
            />
          }
          title={<a href="https://ant.design">{product.name}</a>}
          description={product.description}
        />
        <p>{`${product.amount} x  ${converPrice(product.price)}`}</p>
      </List.Item>
    ));
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: state?.token,
        name: state?.name
      },
    });
  };

  const mutation = useMutationHooks((data)=> {
    const { id, token} = data;
    const res = OrderService.cancelOrder(id, token);
    return res
  })
  const handleCancelOrder = (id) => {
    mutation.mutate({id, token: state?.token},{
      onSettled: () => {
        queryOrder.refetch()
      }
    })
  }


  console.log(data);

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
                <SmileOutlined /> Chào {state?.name}
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
          {data?.map((order) => {
            return (
              <div className="card border-1 mt-3">
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
                    <Button style={{ marginRight: "10px" }}>
                      Hủy đơn hàng
                    </Button>

                    <Button onClick={() => handleDetailsOrder(order?._id)}>
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrderPage;
