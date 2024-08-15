import React from "react";
import { Chart } from "react-google-charts";
import { convertDataChart } from "../../utils";

const PieChartPrice = ({ data, dateRange }) => {
  let chartData = [];
  let chartOptions = {};

  if (data && data.length > 0) {
    chartData = convertDataChart(data, "paymentMethod", dateRange);
    chartData = [
      ["Payment Method", "Value"],
      ...chartData.map((item) => [item.name, item.value]),
    ];
  }

  chartOptions = {
    pieSliceText: "percentage",
    pieStartAngle: 100,
    slices: {
      0: { label: "Thanh toán 1" },
      1: { label: "Thanh toán 2" },
      2: { label: "Thanh toán 3" },
    },
    chartArea: { width: "100%", height: "80%" },
    legend: { position: "top" },
    is3D: true,
  };
  return (
    <div style={{ width: "100%", height: 515 }}>
      <Chart
        width={"100%"}
        height={"100%"}
        chartType="PieChart"
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
};

export default PieChartPrice;
