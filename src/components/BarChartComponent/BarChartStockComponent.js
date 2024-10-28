import React from "react";
import ReactApexChart from "react-apexcharts";
import * as DashboardService from "../../services/DashboardService";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

const BarChartStock = ({ access_token }) => {
  const getchartProductStock = async () => {
    const res = await DashboardService.getchartProductStock(access_token);
    console.log("Response data: ", res?.data);
    return res?.data;
  };

  const { isLoading, data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: getchartProductStock,
  });

  const productNames = Array.isArray(products)
    ? products.map((item) => item?.productName)
    : [];
  const stockQuantities = Array.isArray(products)
    ? products.map((item) => item?.countInStock)
    : [];

  const options = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 5,
        columnWidth: "25%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories: productNames,
    },
    legend: {
      position: "bottom",
      show: false,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " sản phẩm";
        },
      },
    },
  };

  const series = [
    {
      name: "Số lượng tồn kho",
      data: stockQuantities,
    },
  ];

  return (
    <div
      className="chart-container p-3 mb-3"
      style={{ height: "50%", border: "1px solid #ccc", borderRadius: 5 }}
    >
      <h5>Biểu đồ sản phẩm có lượng tồn kho thấp nhất</h5>
      {isLoading ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin spinning={isLoading} tip="Loading" size="large" />
        </div>
      ) : (
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      )}
    </div>
  );
};

export default BarChartStock;
