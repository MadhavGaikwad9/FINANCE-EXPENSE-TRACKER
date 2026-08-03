import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseChart({ transactions = [], currency = "INR" }) {
  // Aggregate expenses by category
  const categoryMap = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });

  const categories = Object.keys(categoryMap);
  const dataValues = Object.values(categoryMap);

  const colors = [
    "#6366f1", // indigo
    "#10b981", // emerald
    "#f43f5e", // rose
    "#f59e0b", // amber
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#94a3b8"  // slate
  ];

  const data = {
    labels: categories.length > 0 ? categories : ["No Expenses"],
    datasets: [
      {
        label: "Category Expense Breakdown",
        data: dataValues.length > 0 ? dataValues : [0],
        backgroundColor: colors.slice(0, Math.max(categories.length, 1)),
        borderColor: "var(--panel-bg)",
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "var(--text-main)",
          font: {
            size: 11,
            family: "Inter"
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw || 0;
            return ` ${context.label}: ${val.toLocaleString()}`;
          }
        }
      }
    }
  };

  return (
    <div style={styles.chartWrapper}>
      <Pie data={data} options={options} />
    </div>
  );
}

const styles = {
  chartWrapper: {
    width: "100%",
    height: "260px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
};

export default ExpenseChart;