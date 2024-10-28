import { Card, Spin } from "antd";
import React from "react";
import ReactApexChart from "react-apexcharts";
import * as DashboardService from "../../services/DashboardService";
import { useQuery } from "@tanstack/react-query";

const PieChartLowStock = ({ access_token }) => {
  const contentStyle = {
    padding: 50,
    background: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
  };
  const content = <div style={contentStyle} />;
  const getStockPercentage = async () => {
    const res = await DashboardService.getstockPercentage(access_token);
    console.log("API Response:", res?.data);
    return res?.data;
  };

  const { isLoading, data } = useQuery({
    queryKey: ["stock"],
    queryFn: getStockPercentage,
  });

  // Kiểm tra xem `data` đã được tải chưa
  const labels = ["Sắp hết hàng", "Còn hàng"];
  const values = data ? [data.lowStockPercentage, data.inStockPercentage] : [];

  const options = {
    labels: labels,
    legend: {
      position: "top",
      show: true,
    },

    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "top",
            show: true,
          },
        },
      },
    ],
  };

  const series = values;

  return (
    <Card className="mb-3" title="Tỉ lệ sản phẩm sắp hết hàng" bordered={true}>
      {isLoading ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            minHeight: 350,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin tip="Loading" size="large" />
        </div>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="pie"
          height={350}
        />
      )}
    </Card>
  );
};

export default PieChartLowStock;
