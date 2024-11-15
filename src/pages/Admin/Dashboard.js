import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/es/layout/layout";
import React, { useState } from "react";
import { Button, Layout, theme } from "antd";
import SiderComponent from "../../components/SiderComponent/SiderComponent";
import { useSelector } from "react-redux";
import "../../css/info-box.css";
import BarChartComponent from "../../components/BarChartComponent/BarChartRevenueComponent";
import DashboardSummary from "../../components/DashboardSummary/DashboardSummary";
import PieChartStockByCategory from "../../components/PieChartComponent/PieChartStockByCategoryComponent";
import PieChartLowStock from "../../components/PieChartComponent/PieChartLowStockComponent";
import BarChartStock from "../../components/BarChartComponent/BarChartStockComponent";

const Dashboard = () => {
  const user = useSelector((state) => state?.user);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [marginLeft, setMarginLeft] = useState(80);
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    setMarginLeft(collapsed ? 200 : 80);
  };

  return (
 
      <Layout>
        <SiderComponent collapsed={collapsed} user={user} selectKey={"1"} />
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
              DASHBOARD
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
            <div className="container-fluid">
              <div class="row">
                <div class="col-md-3">
                  <DashboardSummary />
                </div>

                <div class="col-md-6">
                  <BarChartComponent token={user.access_token} />
                  <BarChartStock token={user.access_token} />
                </div>

                <div class="col-md-3">
                  <PieChartStockByCategory token={user.access_token} />
                  <PieChartLowStock token={user.access_token}/>
                </div>
              </div>
            </div>
          </Content>
        </Layout>
      </Layout>
 
  );
};

export default Dashboard;
