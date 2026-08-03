import React, { useState, useEffect } from "react";
import API from "../api/axios";
import { formatCurrency } from "../utils/Currency";

function BudgetCard({ transactions = [], currency = "INR" }) {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState("Food");
  const [limit, setLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const categories = ["Food", "Travel", "Bills", "Shopping", "Entertainment", "Healthcare", "Others"];

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await API.get("/transactions/budgets");
      if (res.data.success) {
        setBudgets(res.data.budgets);
      }
    } catch (err) {
      console.error("Error fetching budgets:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!limit || parseFloat(limit) <= 0) return;
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/transactions/budgets", {
        category,
        limit: parseFloat(limit)
      });
      if (res.data.success) {
        setMessage("Budget set successfully!");
        setLimit("");
        fetchBudgets();
      }
    } catch (err) {
      console.error(err);
      setMessage("Error updating budget limit.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await API.delete(`/transactions/budgets/${id}`);
      if (res.data.success) {
        fetchBudgets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate current month spending per category from transactions
  const getCategorySpending = (catName) => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return (
          t.type === "expense" &&
          t.category === catName &&
          tDate >= startOfMonth
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="glass-panel" style={styles.container}>
      <h3 style={styles.title}>Category Budgets</h3>
      <p style={styles.subtitle}>Track current month expenditures against your targets</p>

      {/* Set Budget Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputsGrid}>
          <div style={{ flex: 1.5 }}>
            <label className="form-label">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
              style={styles.select}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label className="form-label">Limit Amount</label>
            <input
              type="number"
              placeholder="e.g. 5000"
              className="form-input"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              required
            />
          </div>
          <div style={{ display: "flex", alignItems: "flex-end" }}>
            <button type="submit" className="btn-primary" style={styles.addBtn} disabled={loading}>
              Set
            </button>
          </div>
        </div>
      </form>

      {message && <p style={styles.feedback}>{message}</p>}

      {/* Budgets Tracker List */}
      <div style={styles.listContainer}>
        {budgets.length === 0 ? (
          <p style={styles.emptyState}>No category budgets configured yet.</p>
        ) : (
          budgets.map((b) => {
            const spent = getCategorySpending(b.category);
            const percent = Math.min((spent / b.limit) * 100, 100);
            const remaining = b.limit - spent;

            let progressColor = "var(--success)";
            if (percent > 90) {
              progressColor = "var(--danger)";
            } else if (percent > 70) {
              progressColor = "var(--warning)";
            }

            return (
              <div key={b._id} style={styles.budgetItem}>
                <div style={styles.budgetHeader}>
                  <div>
                    <span style={styles.categoryName}>{b.category}</span>
                    <span style={styles.spentInfo}>
                      {formatCurrency(spent, currency)} spent of {formatCurrency(b.limit, currency)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(b._id)}
                    style={styles.deleteBtn}
                    title="Remove Budget Limit"
                  >
                    ×
                  </button>
                </div>

                <div style={styles.progressContainer}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: `${percent}%`,
                      backgroundColor: progressColor
                    }}
                  />
                </div>

                <div style={styles.budgetFooter}>
                  <span style={{ color: remaining >= 0 ? "var(--text-muted)" : "var(--danger)", fontSize: "11px", fontWeight: "500" }}>
                    {remaining >= 0
                      ? `${formatCurrency(remaining, currency)} remaining`
                      : `Overspent by ${formatCurrency(Math.abs(remaining), currency)}!`}
                  </span>
                  <span style={styles.percentText}>{percent.toFixed(0)}%</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    height: "100%",
  },
  title: {
    fontSize: "18px",
    color: "var(--text-main)",
  },
  subtitle: {
    fontSize: "12px",
    color: "var(--text-muted)",
    marginTop: "-8px",
    marginBottom: "4px",
  },
  form: {
    width: "100%",
  },
  inputsGrid: {
    display: "flex",
    gap: "12px",
    alignItems: "stretch",
  },
  select: {
    height: "43px",
  },
  addBtn: {
    height: "43px",
    padding: "0 16px",
  },
  feedback: {
    fontSize: "12px",
    color: "var(--success)",
    fontWeight: "500",
  },
  listContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    marginTop: "8px",
    maxHeight: "260px",
    overflowY: "auto",
    paddingRight: "4px",
  },
  emptyState: {
    fontSize: "13px",
    color: "var(--text-muted)",
    textAlign: "center",
    padding: "20px 0",
  },
  budgetItem: {
    background: "var(--input-bg)",
    border: "1px solid var(--panel-border)",
    padding: "14px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  budgetHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  categoryName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "var(--text-main)",
    display: "block",
  },
  spentInfo: {
    fontSize: "11px",
    color: "var(--text-muted)",
    display: "block",
    marginTop: "2px",
  },
  deleteBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "18px",
    cursor: "pointer",
    padding: "0 4px",
    lineHeight: "1",
  },
  progressContainer: {
    width: "100%",
    height: "8px",
    backgroundColor: "var(--input-border)",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.4s ease",
  },
  budgetFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  percentText: {
    fontSize: "11px",
    fontWeight: "600",
    color: "var(--text-main)",
  }
};

export default BudgetCard;