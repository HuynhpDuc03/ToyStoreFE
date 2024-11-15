import React from "react";
import { Chart } from "react-google-charts";
import { convertDataChart } from "../../utils";
import { useTranslation } from "react-i18next";

const PieChartPrice = ({ data, dateRange,isLoading }) => {
  let chartData = [];
  let chartOptions = {};
  const { t } = useTranslation();
  if (data && data.length > 0) {
    chartData = convertDataChart(data, "paymentMethod", dateRange, t);
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
        loader={isLoading}
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
