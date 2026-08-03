import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MonthlyExpenseChart({ transactions = [], currency = "INR" }) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  // Calculate the past 6 months dynamically
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    // Use date logic safety by setting date to 1 first (prevents overflow on 31st of month)
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    last6Months.push({
      year: d.getFullYear(),
      month: d.getMonth(),
      label: `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`
    });
  }

  const monthlyData = last6Months.map((m) => {
    return transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return (
          t.type === "expense" &&
          tDate.getFullYear() === m.year &&
          tDate.getMonth() === m.month
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  });

  const data = {
    labels: last6Months.map((m) => m.label),
    datasets: [
      {
        label: "Total Expenses",
        data: monthlyData,
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        hoverBackgroundColor: "var(--primary)",
        borderRadius: 6,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const raw = context.raw || 0;
            return ` Spent: ${raw.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "var(--panel-border)"
        },
        ticks: {
          color: "var(--text-muted)",
          font: {
            size: 10,
            family: "Inter"
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: "var(--text-muted)",
          font: {
            size: 10,
            family: "Inter"
          }
        }
      },
    },
  };

  return (
    <div style={styles.chartWrapper}>
      <Bar data={data} options={options} />
    </div>
  );
}

const styles = {
  chartWrapper: {
    width: "100%",
    height: "260px",
  },
};

export default MonthlyExpenseChart;