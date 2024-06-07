import {
  EnvironmentOutlined,
  PhoneOutlined,
  TruckOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Form, Input, List, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/userSlide";
import * as OrderService from "../../services/OrderService";
import VnProvinces from "vn-local-plus";
import { useQuery } from "@tanstack/react-query";
import { converPrice } from "../../utils";
import { orderContant } from "../../contant";

const MyOrderPage = () => {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = VnProvinces.getProvinces();
        setProvinces(res);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (city) {
        try {
          const res = VnProvinces.getDistrictsByProvinceCode(city);
          setDistricts(res);
          const currentDistrict = res.find((d) => d.code === district);
          if (currentDistrict) {
            setDistrict(currentDistrict.code);
          }
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [city]);

  useEffect(() => {
    const fetchWards = async () => {
      if (district) {
        try {
          const res = VnProvinces.getWardsByDistrictCode(district);
          setWards(res);
          const currentWard = res.find((w) => w.code === ward);
          if (currentWard) {
            setWard(currentWard.code);
          }
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      }
    };
    fetchWards();
  }, [district]);

  const handleProvinceChange = async (value) => {
    setCity(value);
    setDistrict("");
    setWard("");
    try {
      const res = VnProvinces.getDistrictsByProvinceCode(value);
      setDistricts(res);
      setWards([]);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const handleDistrictChange = async (value) => {
    setDistrict(value);
    setWard("");
    try {
      const res = VnProvinces.getWardsByDistrictCode(value);
      setWards(res);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleWardChange = (value) => {
    setWard(value);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const data123 = [
    {
      title: "Ant Design Title 1",
    },
    {
      title: "Ant Design Title 2",
    },
    {
      title: "Ant Design Title 3",
    },
    {
      title:
        "Ant Design Title 4aaaaaaaaaaaaaaaaaaaaaaaaaaaaa sssssssssssssssssssssssssssss ddddddddddddddddddddddddddddd",
    },
  ];

  const location = useLocation();
  const { state } = location;
  console.log(state);
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
          avatar={<Avatar size={80} src={require(`../../img/product/${product?.image}`)} />}
          title={<a href="https://ant.design">{product.name}</a>}
          description={product.description}
        />
        <p>{`${product.amount} x  ${converPrice(product.price)}`}</p>
      </List.Item>
    ));
  };

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
                Tài khoản của bạn
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
                  Mã đơn hàng: <span>{order?._id}</span> | Ngày đặt:{" "}
                  <span>{formatDate(order?.createdAt)} </span>| Thanh toán:{" "}
                  <span>{orderContant.payment[order?.paymentMethod]}</span>
                </div>

                <div className="card-body" style={{ paddingTop: "10px" }}>
                <List itemLayout="horizontal">
                    {renderProduct(order?.orderItems)}
                  </List>
                </div>
                  <div>

                  <p style={{float:"right"}}>Tổng tiền: {converPrice(order?.totalPrice)}</p>
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
