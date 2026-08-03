import React, { useState, useEffect } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import ExpenseChart from "../components/ExpenseChart";
import MonthlyExpenseChart from "../components/MonthlyExpenseChart";
import ReportGenerator from "../components/ReportGenerator";
import BudgetCard from "../components/BudgetCard";
import AISuggestion from "../components/aiSuggestion"; // lowercase correct casing
import Notification from "../components/Notification";
import { formatCurrency } from "../utils/Currency"; // capital C correct casing

function Dashboard({ user, setUser, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [recurringBills, setRecurringBills] = useState([]);
  const [triggerAI, setTriggerAI] = useState(0);

  // Forms states
  const [txTitle, setTxTitle] = useState("");
  const [txAmount, setTxAmount] = useState("");
  const [txCategory, setTxCategory] = useState("Food");
  const [txType, setTxType] = useState("expense");
  const [txDescription, setTxDescription] = useState("");
  const [txDate, setTxDate] = useState("");
  const [addingTx, setAddingTx] = useState(false);

  // Filters states
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Recurring Bill states
  const [billTitle, setBillTitle] = useState("");
  const [billAmount, setBillAmount] = useState("");
  const [billCategory, setBillCategory] = useState("Bills");
  const [billFrequency, setBillFrequency] = useState("monthly");
  const [billDueDate, setBillDueDate] = useState("");
  const [addingBill, setAddingBill] = useState(false);

  // User limits setting states
  const [showSettings, setShowSettings] = useState(false);
  const [prefCurrency, setPrefCurrency] = useState(user?.currency || "INR");
  const [prefBudget, setPrefBudget] = useState(user?.monthlyBudget || 0);

  useEffect(() => {
    fetchTransactions();
    fetchRecurringBills();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      if (res.data.success) {
        setTransactions(res.data.transactions);
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
    }
  };

  const fetchRecurringBills = async () => {
    try {
      const res = await API.get("/recurring");
      if (res.data.success) {
        setRecurringBills(res.data.payments);
      }
    } catch (err) {
      console.error("Error loading recurring bills:", err);
    }
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!txTitle || !txAmount || parseFloat(txAmount) <= 0) return;
    setAddingTx(true);

    try {
      const res = await API.post("/transactions", {
        title: txTitle,
        amount: parseFloat(txAmount),
        category: txCategory,
        type: txType,
        description: txDescription,
        date: txDate || undefined
      });

      if (res.data.success) {
        // Clear inputs
        setTxTitle("");
        setTxAmount("");
        setTxDescription("");
        setTxDate("");
        
        // Refresh local data & trigger AI advisory reload
        fetchTransactions();
        setTriggerAI(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create transaction.");
    } finally {
      setAddingTx(false);
    }
  };

  const handleDeleteTransaction = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction record?")) return;
    try {
      const res = await API.delete(`/transactions/${id}`);
      if (res.data.success) {
        fetchTransactions();
        setTriggerAI(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRecurringBill = async (e) => {
    e.preventDefault();
    if (!billTitle || !billAmount || !billDueDate || parseFloat(billAmount) <= 0) return;
    setAddingBill(true);

    try {
      const res = await API.post("/recurring", {
        title: billTitle,
        amount: parseFloat(billAmount),
        category: billCategory,
        frequency: billFrequency,
        nextDueDate: billDueDate
      });

      if (res.data.success) {
        setBillTitle("");
        setBillAmount("");
        setBillDueDate("");
        fetchRecurringBills();
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create scheduled bill.");
    } finally {
      setAddingBill(false);
    }
  };

  const handleDeleteRecurringBill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scheduled recurring bill?")) return;
    try {
      const res = await API.delete(`/recurring/${id}`);
      if (res.data.success) {
        fetchRecurringBills();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      // 1. Save Currency
      const resCurr = await API.put("/user/currency", { currency: prefCurrency });
      // 2. Save Budget Limit
      const resBudg = await API.put("/user/budget", { monthlyBudget: parseFloat(prefBudget) });

      if (resCurr.data.success && resBudg.data.success) {
        setUser(resBudg.data.user);
        setShowSettings(false);
        setTriggerAI(prev => prev + 1);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving financial preferences.");
    }
  };

  // Calculations
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100) : 0;

  // Filtered transactions list
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesCategory = filterCategory === "all" || t.category === filterCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  const categories = ["Food", "Travel", "Bills", "Shopping", "Entertainment", "Healthcare", "Others"];

  return (
    <div id="dashboard" style={styles.dashboardContainer}>
      {/* Real-time toaster alerts portal */}
      <Notification userId={user?._id || user?.id} />

      {/* Modern navigation header */}
      <Navbar user={user} onLogout={onLogout} />

      {/* Main Stats Grid */}
      <div style={styles.gridStats}>
        <div className="glass-panel animate-fade-in" style={styles.statCard}>
          <span style={styles.statLabel}>NET LIQUID BALANCE</span>
          <h2 style={{ ...styles.statVal, color: netBalance >= 0 ? "var(--success)" : "var(--danger)" }}>
            {formatCurrency(netBalance, user?.currency || "INR")}
          </h2>
          <span style={styles.statSub}>Overall active surplus</span>
        </div>

        <div className="glass-panel animate-fade-in" style={{ ...styles.statCard, animationDelay: "0.05s" }}>
          <span style={styles.statLabel}>TOTAL MONTHLY INCOME</span>
          <h2 style={{ ...styles.statVal, color: "var(--success)" }}>
            {formatCurrency(totalIncome, user?.currency || "INR")}
          </h2>
          <span style={styles.statSub}>From salaries, yields</span>
        </div>

        <div className="glass-panel animate-fade-in" style={{ ...styles.statCard, animationDelay: "0.1s" }}>
          <span style={styles.statLabel}>TOTAL MONTHLY OUTFLOW</span>
          <h2 style={{ ...styles.statVal, color: "var(--danger)" }}>
            {formatCurrency(totalExpense, user?.currency || "INR")}
          </h2>
          <span style={styles.statSub}>From bills, groceries, shopping</span>
        </div>

        <div className="glass-panel animate-fade-in" style={{ ...styles.statCard, animationDelay: "0.15s" }}>
          <span style={styles.statLabel}>AGGREGATE SAVINGS RATE</span>
          <h2 style={{ ...styles.statVal, color: savingsRate >= 20 ? "var(--success)" : savingsRate > 0 ? "var(--warning)" : "var(--danger)" }}>
            {savingsRate.toFixed(1)}%
          </h2>
          <span style={styles.statSub}>Target benchmark: 20%</span>
        </div>
      </div>

      {/* Bottom Main Content Section */}
      <div style={styles.mainLayout}>
        {/* Left Hand Column: Inputs, Budgets & Schedules */}
        <div style={styles.leftCol}>
          {/* Settings Card */}
          <div className="glass-panel" style={styles.settingsCard}>
            <div style={styles.flexHeader}>
              <h3 style={styles.sectionTitle}>Vault Preferences</h3>
              <button
                className="btn-secondary"
                style={styles.smallToggle}
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? "Hide" : "Configure"}
              </button>
            </div>
            {showSettings ? (
              <form onSubmit={handleSaveSettings} style={styles.settingsForm}>
                <div style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Active Currency</label>
                    <select
                      value={prefCurrency}
                      onChange={(e) => setPrefCurrency(e.target.value)}
                      className="form-input"
                    >
                      <option value="INR">INR ₹</option>
                      <option value="USD">USD $</option>
                      <option value="EUR">EUR €</option>
                      <option value="GBP">GBP £</option>
                    </select>
                  </div>
                  <div style={{ flex: 1.5 }}>
                    <label className="form-label">Global Monthly Limit</label>
                    <input
                      type="number"
                      className="form-input"
                      value={prefBudget}
                      onChange={(e) => setPrefBudget(e.target.value)}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: "10px", width: "100%", justifyContent: "center" }}>
                  Update Preferences
                </button>
              </form>
            ) : (
              <div style={styles.prefDisplay}>
                <p><strong>Primary Currency:</strong> {user?.currency || "INR"}</p>
                <p><strong>Monthly Limit Target:</strong> {user?.monthlyBudget > 0 ? formatCurrency(user.monthlyBudget, user.currency) : "No Target Configured"}</p>
              </div>
            )}
          </div>

          {/* Quick Transaction Modeler */}
          <div className="glass-panel" style={styles.formCard}>
            <h3 style={styles.sectionTitle}>Post Transaction</h3>
            <form onSubmit={handleAddTransaction} style={styles.addTxForm}>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1.5 }}>
                  <label className="form-label">Transaction Label</label>
                  <input
                    type="text"
                    placeholder="groceries, rent, client payout..."
                    className="form-input"
                    value={txTitle}
                    onChange={(e) => setTxTitle(e.target.value)}
                    required
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Amount</label>
                  <input
                    type="number"
                    placeholder="e.g. 150"
                    className="form-input"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Category</label>
                  <select
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    className="form-input"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Flow Direction</label>
                  <select
                    value={txType}
                    onChange={(e) => setTxType(e.target.value)}
                    className="form-input"
                  >
                    <option value="expense">Expense (Outflow)</option>
                    <option value="income">Income (Inflow)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <div style={{ flex: 1.2 }}>
                  <label className="form-label">Memo Description</label>
                  <input
                    type="text"
                    placeholder="Optional notes..."
                    className="form-input"
                    value={txDescription}
                    onChange={(e) => setTxDescription(e.target.value)}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: "16px", width: "100%", justifyContent: "center" }} disabled={addingTx}>
                {addingTx ? "Logging Statement..." : "Log Flow Statement"}
              </button>
            </form>
          </div>

          {/* Budgets Progress Tracker */}
          <BudgetCard transactions={transactions} currency={user?.currency || "INR"} />
        </div>

        {/* Right Hand Column: Analytics & List view */}
        <div style={styles.rightCol}>
          {/* AI Advisor Insights Dashboard */}
          <AISuggestion triggerRefresh={triggerAI} />

          {/* Visual Analytics Canvas Panels */}
          <div style={styles.chartsGrid}>
            <div className="glass-panel" style={styles.chartCard}>
              <h4 style={styles.chartTitle}>Expense Category Weights</h4>
              <ExpenseChart transactions={transactions} currency={user?.currency || "INR"} />
            </div>

            <div className="glass-panel" style={styles.chartCard}>
              <h4 style={styles.chartTitle}>Six Months Flow Trend</h4>
              <MonthlyExpenseChart transactions={transactions} currency={user?.currency || "INR"} />
            </div>
          </div>

          {/* Statement List ledger */}
          <div className="glass-panel" style={styles.ledgerCard}>
            <div style={styles.ledgerHeader}>
              <div>
                <h3 style={styles.sectionTitle}>Transactional Statement Ledger</h3>
                <span style={styles.subText}>Inspect, filter, and audit item records</span>
              </div>
              <div style={{ width: "240px" }}>
                <ReportGenerator />
              </div>
            </div>

            {/* Filter controls */}
            <div style={styles.filtersBar}>
              <div style={{ flex: 1.5 }}>
                <input
                  type="text"
                  placeholder="🔍 Search label..."
                  className="form-input"
                  style={styles.searchFilter}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="form-input"
                  style={styles.selectFilter}
                >
                  <option value="all">All Flow</option>
                  <option value="income">Inflow Only</option>
                  <option value="expense">Outflow Only</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="form-input"
                  style={styles.selectFilter}
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Statement Ledger Table */}
            <div style={styles.tableScroll}>
              {filteredTransactions.length === 0 ? (
                <p style={styles.emptyState}>No matching flow statements logged.</p>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.tableRowHead}>
                      <th style={styles.th}>Label</th>
                      <th style={styles.th}>Flow Category</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((tx) => (
                      <tr key={tx._id} style={styles.tableRow}>
                        <td style={styles.td}>
                          <div style={{ fontWeight: "600", color: "var(--text-main)" }}>{tx.title}</div>
                          {tx.description && <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>{tx.description}</div>}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.categoryBadge}>{tx.category}</span>
                        </td>
                        <td style={styles.td}>
                          {new Date(tx.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td style={{ ...styles.td, fontWeight: "700", color: tx.type === "income" ? "var(--success)" : "var(--danger)" }}>
                          {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount, user?.currency || "INR")}
                        </td>
                        <td style={styles.td}>
                          <button
                            onClick={() => handleDeleteTransaction(tx._id)}
                            style={styles.deleteTxBtn}
                            title="Delete Statement Record"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Scheduled Bills Scheduler */}
          <div className="glass-panel" style={styles.recurringCard}>
            <div style={styles.flexHeader}>
              <div>
                <h3 style={styles.sectionTitle}>Scheduled Bills & Subscriptions</h3>
                <p style={styles.subText}>Manage automatic recurring items registered in cron</p>
              </div>
              <button
                className="btn-secondary"
                style={styles.smallToggle}
                onClick={() => setAddingBill(!addingBill)}
              >
                {addingBill ? "Cancel" : "📅 Schedule Bill"}
              </button>
            </div>

            {addingBill && (
              <form onSubmit={handleAddRecurringBill} style={styles.billForm}>
                <div style={styles.formRow}>
                  <div style={{ flex: 1.5 }}>
                    <label className="form-label">Subscription/Bill Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Netflix, Rent, Electric Bill"
                      className="form-input"
                      value={billTitle}
                      onChange={(e) => setBillTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Outflow Amount</label>
                    <input
                      type="number"
                      placeholder="15"
                      className="form-input"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div style={{ ...styles.formRow, marginTop: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Category</label>
                    <select
                      value={billCategory}
                      onChange={(e) => setBillCategory(e.target.value)}
                      className="form-input"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Billing Interval</label>
                    <select
                      value={billFrequency}
                      onChange={(e) => setBillFrequency(e.target.value)}
                      className="form-input"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label className="form-label">Next Bill Due Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={billDueDate}
                      onChange={(e) => setBillDueDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: "14px", width: "100%", justifyContent: "center" }}>
                  Add to Scheduled Registry
                </button>
              </form>
            )}

            <div style={styles.billsGrid}>
              {recurringBills.length === 0 ? (
                <p style={styles.emptyState}>No scheduled bills configured.</p>
              ) : (
                recurringBills.map((bill) => (
                  <div key={bill._id} style={styles.billItem}>
                    <div>
                      <div style={styles.billTitle}>{bill.title}</div>
                      <div style={styles.billDesc}>
                        {formatCurrency(bill.amount, user?.currency || "INR")} • {bill.frequency}
                      </div>
                      <div style={styles.billNextDate}>
                        Next: {new Date(bill.nextDueDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteRecurringBill(bill._id)}
                      style={styles.deleteBillBtn}
                      title="Deactivate subscription"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  gridStats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
  statCard: {
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  statLabel: {
    fontSize: "10px",
    color: "var(--text-muted)",
    fontWeight: "700",
    letterSpacing: "0.05em",
  },
  statVal: {
    fontSize: "26px",
    fontWeight: "800",
  },
  statSub: {
    fontSize: "11px",
    color: "var(--text-muted)",
  },
  mainLayout: {
    display: "grid",
    gridTemplateColumns: "1.1fr 2fr",
    gap: "24px",
    alignItems: "start",
    // Responsive wrap
    "@media (max-width: 1024px)": {
      gridTemplateColumns: "1fr",
    }
  },
  leftCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  settingsCard: {
    padding: "20px",
  },
  flexHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
  },
  sectionTitle: {
    fontSize: "16px",
    color: "var(--text-main)",
    fontWeight: "700",
  },
  smallToggle: {
    padding: "5px 10px",
    fontSize: "12px",
    borderRadius: "6px",
  },
  settingsForm: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  prefDisplay: {
    fontSize: "13px",
    color: "var(--text-main)",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  formCard: {
    padding: "20px",
  },
  addTxForm: {
    display: "flex",
    flexDirection: "column",
    marginTop: "12px",
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "1fr"
    }
  },
  chartCard: {
    padding: "20px",
  },
  chartTitle: {
    fontSize: "14px",
    color: "var(--text-muted)",
    marginBottom: "14px",
    textAlign: "center",
  },
  ledgerCard: {
    padding: "24px",
  },
  ledgerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    flexWrap: "wrap",
    gap: "12px",
  },
  subText: {
    fontSize: "12px",
    color: "var(--text-muted)",
  },
  filtersBar: {
    display: "flex",
    gap: "12px",
    marginBottom: "18px",
  },
  searchFilter: {
    padding: "9px 12px",
  },
  selectFilter: {
    padding: "9px 12px",
  },
  tableScroll: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  tableRowHead: {
    borderBottom: "2px solid var(--input-border)",
  },
  th: {
    padding: "10px 12px",
    fontSize: "12px",
    color: "var(--text-muted)",
    fontWeight: "600",
  },
  tableRow: {
    borderBottom: "1px solid var(--input-border)",
    "&:nth-of-type(even)": {
      backgroundColor: "var(--table-stripe)"
    }
  },
  td: {
    padding: "12px",
    fontSize: "13px",
  },
  categoryBadge: {
    padding: "3px 8px",
    background: "var(--primary-glow)",
    color: "var(--primary)",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: "600",
  },
  deleteTxBtn: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  },
  recurringCard: {
    padding: "24px",
  },
  billForm: {
    background: "var(--input-bg)",
    border: "1px solid var(--panel-border)",
    padding: "16px",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  formRow: {
    display: "flex",
    gap: "10px",
  },
  billsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "12px",
    marginTop: "12px",
  },
  billItem: {
    background: "var(--input-bg)",
    border: "1px solid var(--panel-border)",
    padding: "12px 14px",
    borderRadius: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  billTitle: {
    fontSize: "13.5px",
    fontWeight: "600",
    color: "var(--text-main)",
  },
  billDesc: {
    fontSize: "11px",
    color: "var(--text-muted)",
    marginTop: "2px",
  },
  billNextDate: {
    fontSize: "9.5px",
    color: "var(--warning)",
    fontWeight: "600",
    marginTop: "4px",
  },
  deleteBillBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "20px",
    cursor: "pointer",
    lineHeight: "1",
  },
  emptyState: {
    fontSize: "13px",
    color: "var(--text-muted)",
    textAlign: "center",
    padding: "16px 0",
  }
};

export default Dashboard;