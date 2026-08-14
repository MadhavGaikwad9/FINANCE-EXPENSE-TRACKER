import React from "react";
import { Line } from "react-chartjs-2";

function Analytics() {
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Spending",
        data: [1200, 950, 1130, 980, 1070, 940],
        borderColor: "#0d6efd",
        backgroundColor: "rgba(13, 110, 253, 0.15)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h1 className="h3">Analytics</h1>
        <p className="text-muted">Track your expense trends and cash flow performance.</p>
      </div>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <Line data={data} />
        </div>
      </div>
    </div>
  );
}

export default Analytics;
