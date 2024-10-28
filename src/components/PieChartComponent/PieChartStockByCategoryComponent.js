import { Card, Spin } from "antd";
import React from "react";
import ReactApexChart from "react-apexcharts";
import * as DashboardService from "../../services/DashboardService";
import { useQuery } from "@tanstack/react-query";

const PieChartStockByCategory = ({ access_token }) => {
  const getChartCategoryStock = async () => {
    const res = await DashboardService.chartCategoryStock(access_token);
    console.log("API Response:", res?.data);
    return res?.data;
  };

  const { isLoading, data } = useQuery({
    queryKey: ["categories"],
    queryFn: getChartCategoryStock,
  });

  const categories = Array.isArray(data) ? data.map((item) => item?.type) : [];
  const values = Array.isArray(data)
    ? data.map((item) => item?.totalStock)
    : [];

  const options = {
    labels: categories,
    legend: {
      position: "bottom",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "bottom",
            show: true,
          },
        },
      },
    ],
  };

  const series = values;

  return (
    <Card title="Tỉ lệ tồn kho theo danh mục" bordered={true}>
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

export default PieChartStockByCategory;
