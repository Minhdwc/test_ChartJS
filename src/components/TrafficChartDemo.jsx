import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TrafficChart = () => {
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState("Year");

  useEffect(() => {
    const fetchData = async () => {
      const urlMonth="http://127.0.0.1:8000/api/view/views-by-month";
      const urlYear="http://127.0.0.1:8000/api/view/views-by-year";

      try {
        const response = await fetch(timeRange=="Month"?urlMonth:urlYear);
        console.log(response);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu JSON:", error);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: data ? data.map((item) => (timeRange === "Month" ? item.month+" / "+item.year : item.year)) : [],
    datasets: [
      {
        label: "View",
        data: data ? data.map((item) => item.count) : [],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: `Traffic (${timeRange})`,
        color: "white",
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        background: "linear-gradient(135deg, #ffffff 50%, #1e293b 50%)",
        padding: "20px",
        color: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(30, 41, 59, 0.8)",
          padding: "20px",
          borderRadius: "10px",
          maxWidth: "800px",
          margin: "0 auto",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <h2>Traffic Overview</h2>
          <div>
            <button onClick={() => handleTimeRangeChange("Month")} style={{ margin: "0 5px" }}>
              Month
            </button>
            <button onClick={() => handleTimeRangeChange("Year")} style={{ margin: "0 5px" }}>
              Year
            </button>
          </div>
        </div>
        {data ? (
          <Line data={chartData} options={options} />
        ) : (
          <p>Đang tải dữ liệu...</p>
        )}
      </div>
    </div>
  );
};

export default TrafficChart;
