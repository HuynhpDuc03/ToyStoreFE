import React, { useEffect, useState } from "react";
import { Progress, Card, Spin } from "antd";
import {
  InfoCircleOutlined,
  FileDoneOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { getSummary } from "../../services/DashboardService";

const DashboardSummary = ({ access_token }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true); // State để theo dõi trạng thái loading

  const fetchSummary = async (access_token) => {
    try {
      const res = await getSummary(access_token);
      setSummary(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Dừng loading sau khi fetch xong dữ liệu
    }
  };

  useEffect(() => {
    fetchSummary(access_token);
  }, [access_token]);

  // Map order statuses to display names and icons
  const statusMapping = {
    1: { name: "Chờ xác nhận", icon: <FileDoneOutlined />, color: "#faad14" },
    2: { name: "Đã xác nhận", icon: <CheckCircleOutlined />, color: "#52c41a" },
    3: {
      name: "Đang vận chuyển",
      icon: <ShoppingCartOutlined />,
      color: "#13c2c2",
    },
    4: {
      name: "Đã giao hàng",
      icon: <CheckCircleOutlined />,
      color: "#1890ff",
    },
    5: {
      name: "Đã hủy",
      icon: <ExclamationCircleOutlined />,
      color: "#ff4d4f",
    },
  };

  return (
    <>
      <div className="row mb-4">
        <div className="col-md-12">
          <Card title="Tổng hợp" bordered={true}>
            {loading ? (
              <div
                style={{
                  height: "100%",
                  minHeight: 350,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin tip="Loading" size="large"></Spin>
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>
                      <InfoCircleOutlined /> Tổng sản phẩm
                    </span>
                    <span className="progress-value">
                      {summary?.totalProducts}
                    </span>
                  </div>
                  <Progress
                    percent={100}
                    strokeColor="#1890ff"
                    showInfo={false}
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>
                      <FileDoneOutlined /> Tổng đơn hàng
                    </span>
                    <span className="progress-value">
                      {summary?.totalOrders}
                    </span>
                  </div>
                  <Progress
                    percent={100}
                    strokeColor="#faad14"
                    showInfo={false}
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>
                      <CheckCircleOutlined /> Tổng khách hàng
                    </span>
                    <span className="progress-value">
                      {summary?.totalCustomers}
                    </span>
                  </div>
                  <Progress
                    percent={100}
                    strokeColor="#52c41a"
                    showInfo={false}
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>
                      <WarningOutlined /> Tổng bài viết
                    </span>
                    <span className="progress-value">
                      {summary?.totalArticles}
                    </span>
                  </div>
                  <Progress
                    percent={100}
                    strokeColor="#595959"
                    showInfo={false}
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>
                      <ExclamationCircleOutlined /> Tổng mã giảm giá
                    </span>
                    <span className="progress-value">
                      {summary?.totalCoupons}
                    </span>
                  </div>
                  <Progress
                    percent={100}
                    strokeColor="#ff4d4f"
                    showInfo={false}
                  />
                </div>
              </>
            )}
          </Card>
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="row">
        <div className="col-md-12">
          <Card title="Trạng thái đơn hàng" bordered={true}>
            {loading ? (
              <div
                style={{
                  height: "100%",
                  minHeight: 350,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Spin tip="Loading" size="large" />
              </div>
            ) : (
              summary?.orderStatuses.map((status) => (
                <div key={status.orderStatus} className="mb-3">
                  <div className="d-flex justify-content-between">
                    <span>
                      {statusMapping[status.orderStatus].icon}{" "}
                      {statusMapping[status.orderStatus].name}
                    </span>
                    <span className="progress-value">{status.count}</span>
                  </div>
                  <Progress
                    percent={parseFloat(status.percentage)}
                    strokeColor={statusMapping[status.orderStatus].color}
                    showInfo={false}
                  />
                </div>
              ))
            )}
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardSummary;
