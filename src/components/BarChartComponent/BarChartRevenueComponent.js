import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { Row, Col, Button, Modal, DatePicker, message, Spin } from "antd";
import { getRevenueByChartType } from "../../services/DashboardService";
import { converPrice } from "../../utils";

const { RangePicker } = DatePicker;
const dateFormat = "DD/MM/YYYY";

const BarChartComponent = ({ access_token }) => {
  const [viewMode, setViewMode] = useState("Month"); // Default to "month"
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRange, setSelectedRange] = useState([null, null]); // State for the selected date range
  const [loading, setLoading] = useState(false); // For indicating API call

  // Fetch data from API based on the selected view mode
  const fetchData = async (chartType, fromDate = "", toDate = "") => {
    try {
      setLoading(true);
      const response = await getRevenueByChartType(
        { chartType, fromDate, toDate },
        access_token
      );

      if (response.status === "OK") {
        // Map the response to the format expected by the chart
        const mappedData = response.data.map((item) => ({
          label: item.date, // Assuming 'date' is the label in the response
          totalRevenue: item.totalRevenue,
          itemsSold: item.totalSold, // Adjusting the field to match 'totalSold'
        }));
        setData(mappedData); // Update data for the chart
      } else {
        message.destroy()
        message.error(response.message);
      }
    } catch (error) {
      message.destroy()
      message.error("Error fetching data from API.");
    } finally {
      setLoading(false);
    }
  };

  // Set initial data and fetch month data on component mount
  useEffect(() => {
    fetchData("Month");
  }, []);

  // Handle view mode change (month, quarter, year, range)
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    if (mode === "FromTo") {
      setIsModalVisible(true);
    } else {
      fetchData(mode);
    }
  };

  // Handle range selection
  const handleRangeChange = (dates) => {
    setSelectedRange(dates);
  };

  // Handle modal OK (make an API call with the selected range)
  const handleModalOk = () => {
    if (selectedRange[0] && selectedRange[1]) {
      const fromDate = selectedRange[0].format(dateFormat);
      const toDate = selectedRange[1].format(dateFormat);
      fetchData("FromTo", fromDate, toDate);
    } else {
      message.destroy()
      message.error("Please select a valid date range.");
    }
    setIsModalVisible(false);
  };

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    xaxis: {
      categories: data.map((item) => item.label),
    },
    yaxis: {
      labels: {
        formatter: (value) => converPrice(value), // Áp dụng định dạng cho trục Y
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 5,
        columnWidth: "25%",
        distributed: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      position: "top",
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value) => converPrice(value),
      },
    },
  };
  return (
    <div
      className="chart-container p-3 mb-3"
      style={{ height: "50%", border: "1px solid #ccc", borderRadius: 5 }}
    >
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <h5 style={{ margin: 0 }}>Biểu đồ doanh thu</h5>
        </Col>
        <Col>
          <Row gutter={8}>
            <Col>
              <Button
                type={viewMode === "Month" ? "primary" : "default"}
                onClick={() => handleViewModeChange("Month")}
                loading={loading}
              >
                Tháng
              </Button>
            </Col>
            <Col>
              <Button
                type={viewMode === "3Month" ? "primary" : "default"}
                onClick={() => handleViewModeChange("3Month")}
                loading={loading}
              >
                Quý
              </Button>
            </Col>
            <Col>
              <Button
                type={viewMode === "Year" ? "primary" : "default"}
                onClick={() => handleViewModeChange("Year")}
                loading={loading}
              >
                Năm
              </Button>
            </Col>
            <Col>
              <Button
                type={viewMode === "FromTo" ? "primary" : "default"}
                onClick={() => handleViewModeChange("FromTo")}
                loading={loading}
              >
                Trong khoảng
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      {loading ? (
        <div
          style={{
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spin tip="Loading" size="large" />
        </div>
      ) : (
        <Chart
          options={chartOptions}
          series={[
            {
              name: "Số lượng đã bán",
              data: data.map((item) => item.itemsSold),
            },
            {
              name: "Doanh thu",
              data: data.map((item) => item.totalRevenue),
            },
          ]}
          type="bar"
          height={350}
        />
      )}

      {/* Modal for RangePicker */}
      <Modal
        title="Chọn khoảng thời gian"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <RangePicker format={dateFormat} onChange={handleRangeChange} />
      </Modal>
    </div>
  );
};

export default BarChartComponent;
