import React, { PureComponent } from 'react';
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { converPrice } from "../../utils";
import { orderContant } from "../../contant";
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import PieChartComponent from './chart';

const OrderAdmin = () => {

  const fetchOrderAll = async () => {
    const res = await OrderService.getAllOrder();
    return res;
  };

  const { data: orders } = useQuery({
    queryKey: ["orders"],
    queryFn: fetchOrderAll,
  });



  console.log("orders", orders);
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <div
            className="list-group"
            style={{ fontWeight: "bold", textAlign: "center" }}
          >
            {/* <a href="/" className="list-group-item list-group-item-action active" aria-current="true">
                            Quản lý sản phẩm
                        </a> */}
            <Link
              to="/Admin"
              className="list-group-item list-group-item-action"
            >
              Quản lý Sản Phẩm
            </Link>
            <Link
              to="/AdminOrder"
              className="list-group-item list-group-item-action"
            >
              Quản Lý Đơn Hàng
            </Link>
          </div>
          <div style={{width:"250px", height:"250px"}}>
            <PieChartComponent/>

          </div>
        </div>
        <div className="col-md-9">
          <section class="content">
            <div class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-header">
                    <h3
                      class="card-title"
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        fontSize: 25,
                      }}
                    >
                      Trang Quản Lý Sản Phẩm Và Đơn Hàng Của Người Dùng
                    </h3>
                  </div>

                  <div class="card-body">
                    <table
                      id="example2"
                      class="table table-bordered table-hover"
                    >
                      <thead>
                        <tr>
                          <th>Tên Khách Hàng</th>
                          <th>Số điện thoại</th>
                          <th>Địa chỉ</th>
                          <th>Trạng Thái Thanh Toán</th>
                          <th>Trạng Thái Giao Hàng</th>
                          <th>Phương Thức Thanh Toán</th>
                          <th>Tổng tiền</th>
                          <th>Chức năng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders?.data?.map((order) => {
                          return (
                            <tr>
                              <td>{order?.shippingAddress.fullName}</td>
                              <td>{order?.shippingAddress.phone}</td>
                              <td>{`${order?.shippingAddress.address} ${order?.shippingAddress.city}`}</td>
                              <td>{order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</td>
                              <td>
                                {order?.isDelivered ? "Đã giao" : "Chưa giao"}
                              </td>
                              <td>
                                {" "}
                                {orderContant.payment[order?.paymentMethod]}
                              </td>
                              <td>{converPrice(order?.totalPrice)}</td>
                              <td>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Link to="/DetailOrder"><button type='button' style={{marginLeft:"5px", marginRight:"5px"}} className='btn btn-secondary' >Chi tiết</button></Link>
                                                     
                                                            <Link to="/UpdateOrder"><button type='button' style={{marginLeft:"5px", marginRight:"5px"}} className='btn btn-info' >Cập nhật</button></Link>

                                                        </div>
                          </td>
                            </tr>
                          );
                        })}
                      
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Tên Khách Hàng</th>
                          <th>Số điện thoại</th>
                          <th>Địa chỉ</th>
                          <th>Trạng Thái Thanh Toán</th>
                          <th>Trạng Thái Giao Hàng</th>
                          <th>Phương Thức Thanh Toán</th>
                          <th>Tổng tiền</th>
                          <th>Chức năng</th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default OrderAdmin;
