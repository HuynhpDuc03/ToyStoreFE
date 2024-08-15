import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import { Select, Row, Col, Spin } from "antd";
import * as OrderService from "../../services/OrderService";

const { Option } = Select;

const BarChartComponent = ({ token }) => {
  const [month, setMonth] = useState("all");
  const [year, setYear] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableMonths, setAvailableMonths] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false); // State for loading

  const fetchRevenueData = async (selectedMonth, selectedYear) => {
    if (selectedMonth && selectedYear) {
      setLoading(true); // Start loading
      const response = await OrderService.getRevenueByMonth(
        selectedMonth,
        selectedYear,
        token
      );
      if (response.status === "OK") {
        const chartData = [
          ["Day", "Doanh thu"],
          ...response.data.map((item) => [
            item.day.toString(),
            item.totalRevenue,
          ]),
        ];
        setData(chartData);
      }
      setLoading(false); // End loading
    }
  };

  const fetchAnnualRevenueData = async (selectedYear) => {
    if (selectedYear) {
      setLoading(true); // Start loading
      const response = await OrderService.getAnnualRevenue(selectedYear, token);
      if (response.status === "OK") {
        const chartData = [
          ["Month", "Doanh thu"],
          ...response.data.map((item) => [
            `Tháng ${item.month}`,
            item.totalRevenue,
          ]),
        ];
        setData(chartData);
      }
      setLoading(false); // End loading
    }
  };

  const fetchAvailableYears = async () => {
    const response = await OrderService.getAvailableYears(token);
    if (response.status === "OK") {
      setAvailableYears(response.data);
      if (response.data.length > 0) {
        setYear(response.data[0]);
      }
    }
  };

  const fetchAvailableMonths = async (selectedYear) => {
    if (selectedYear) {
      const response = await OrderService.getAvailableMonths(
        selectedYear,
        token
      );
      if (response.status === "OK") {
        setAvailableMonths(response.data);
      }
    }
  };

  useEffect(() => {
    fetchAvailableYears();
  }, []);

  useEffect(() => {
    if (year) {
      fetchAvailableMonths(year);
      fetchAnnualRevenueData(year); // Fetch annual revenue when year changes
    }
  }, [year]);

  useEffect(() => {
    if (month === "all") {
      fetchAnnualRevenueData(year);
    } else {
      fetchRevenueData(month, year);
    }
  }, [month, year]);

  const handleMonthChange = (value) => setMonth(value);
  const handleYearChange = (value) => setYear(value);

  const chartOptions = {
    hAxis: { title: month === "all" ? "Tháng" : "Ngày", format: "0" },
    vAxis: { title: "Doanh thu" },
    legend: { position: "top", alignment: "center" },
  };

  return (
    <div className="chart-container" style={{height:500}}>
      {loading ? (
        <div className="spinner-container" style={{textAlign:"center"}}>
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={12}>
              <Select
                value={month}
                onChange={handleMonthChange}
                style={{ width: "100%" }}
                placeholder="Select month"
              >
                <Option value="all">Tất cả</Option>
                {availableMonths.map((month) => (
                  <Option key={month} value={month}>{`Tháng ${month}`}</Option>
                ))}
              </Select>
            </Col>
            <Col span={12}>
              <Select
                value={year}
                onChange={handleYearChange}
                style={{ width: "100%" }}
                placeholder="Select year"
              >
                {availableYears.map((year) => (
                  <Option key={year} value={year}>
                    {year}
                  </Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Chart
            width={"100%"}
            height={"400px"}
            chartType="ColumnChart"
            data={data}
            options={chartOptions}
          />
        </>
      )}
    </div>
  );
};
export default BarChartComponent;
