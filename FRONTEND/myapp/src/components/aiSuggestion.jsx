import React, { useEffect, useState } from "react";
import API from "../api/axios";

function AISuggestion({ triggerRefresh = 0 }) {
  const [suggestion, setSuggestion] = useState("");
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuggestions();
  }, [triggerRefresh]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await API.get("/ai/suggestions");
      if (res.data.success) {
        setSuggestion(res.data.suggestion);
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.error("AI fetch failure:", err);
      setSuggestion("Unable to connect with AI models. Please configure your financial profiles and check server status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <div style={styles.header}>
        <div style={styles.advisorAvatar}>
          <div className="glow-effect" style={styles.avatarInner}>🧠</div>
        </div>
        <div>
          <h3 style={styles.title}>AI Advisor Lounge</h3>
          <span style={styles.statusBadge}>Online & Analyzing</span>
        </div>
        <button
          onClick={fetchSuggestions}
          style={styles.refreshBtn}
          disabled={loading}
          title="Regenerate Insights"
        >
          {loading ? "..." : "🔄"}
        </button>
      </div>

      <div style={styles.body}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.shimmerLine}></div>
            <div style={{ ...styles.shimmerLine, width: "80%" }}></div>
            <div style={{ ...styles.shimmerLine, width: "60%" }}></div>
          </div>
        ) : (
          <div style={styles.adviceContent}>
            {suggestion.split("\n\n").map((para, i) => (
              <p key={i} style={styles.paragraph}>
                {para}
              </p>
            ))}
          </div>
        )}
      </div>

      {metrics && !loading && (
        <div style={styles.metricsGrid}>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Savings Rate</span>
            <span
              style={{
                ...styles.metricValue,
                color: metrics.savingsRate >= 20 ? "var(--success)" : metrics.savingsRate > 0 ? "var(--warning)" : "var(--danger)"
              }}
            >
              {metrics.savingsRate}%
            </span>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Net Surplus</span>
            <span
              style={{
                ...styles.metricValue,
                color: metrics.netSavings >= 0 ? "var(--success)" : "var(--danger)"
              }}
            >
              {metrics.netSavings.toLocaleString()}
            </span>
          </div>
          <div style={styles.metricItem}>
            <span style={styles.metricLabel}>Budget Alerts</span>
            <span
              style={{
                ...styles.metricValue,
                color: metrics.budgetWarnings > 0 ? "var(--danger)" : "var(--success)"
              }}
            >
              {metrics.budgetWarnings} Active
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    height: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid var(--panel-border)",
    paddingBottom: "14px",
  },
  advisorAvatar: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInner: {
    fontSize: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
  },
  title: {
    fontSize: "18px",
    color: "var(--text-main)",
  },
  statusBadge: {
    fontSize: "11px",
    color: "var(--success)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginTop: "2px",
    display: "block",
  },
  refreshBtn: {
    marginLeft: "auto",
    background: "transparent",
    border: "none",
    fontSize: "16px",
    cursor: "pointer",
    padding: "6px",
    borderRadius: "6px",
  },
  body: {
    minHeight: "100px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: "10px 0",
  },
  shimmerLine: {
    height: "14px",
    backgroundColor: "var(--input-border)",
    borderRadius: "6px",
    width: "100%",
    animation: "shimmer 1.5s infinite linear",
    opacity: "0.6",
  },
  adviceContent: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  paragraph: {
    fontSize: "13.5px",
    lineHeight: "1.6",
    color: "var(--text-main)",
    fontWeight: "400",
  },
  metricsGrid: {
    display: "flex",
    gap: "12px",
    borderTop: "1px solid var(--panel-border)",
    paddingTop: "16px",
    marginTop: "auto",
  },
  metricItem: {
    flex: 1,
    background: "var(--input-bg)",
    border: "1px solid var(--panel-border)",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  metricLabel: {
    fontSize: "10px",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  metricValue: {
    fontSize: "13px",
    fontWeight: "700",
  }
};

// Add standard keyframe shimmer for loading state dynamically
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes shimmer {
      0% { opacity: 0.4; }
      50% { opacity: 0.8; }
      100% { opacity: 0.4; }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default AISuggestion;