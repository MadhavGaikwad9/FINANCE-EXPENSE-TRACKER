import React, { useState } from "react";
import API from "../api/axios";

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const res = await API.post("/auth/login", { email, password });
        if (res.data.success) {
          onAuthSuccess(res.data.token, res.data.user);
        }
      } else {
        const res = await API.post("/auth/register", { name, email, password });
        if (res.data.success) {
          onAuthSuccess(res.data.token, res.data.user);
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div className="glass-panel animate-fade-in glow-effect" style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#6366F1" />
              <path d="M2 17L12 22L22 17" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 style={styles.title}>FINANCE FLOW</h2>
          <p style={styles.subtitle}>Your AI-Powered Personal Wealth Companion</p>
        </div>

        <div style={styles.tabContainer}>
          <button
            style={{
              ...styles.tab,
              borderBottom: isLogin ? "2.5px solid var(--primary)" : "none",
              color: isLogin ? "var(--text-main)" : "var(--text-muted)",
              fontWeight: isLogin ? "600" : "400"
            }}
            onClick={() => { setIsLogin(true); setError(""); }}
          >
            Sign In
          </button>
          <button
            style={{
              ...styles.tab,
              borderBottom: !isLogin ? "2.5px solid var(--primary)" : "none",
              color: !isLogin ? "var(--text-main)" : "var(--text-muted)",
              fontWeight: !isLogin ? "600" : "400"
            }}
            onClick={() => { setIsLogin(false); setError(""); }}
          >
            Create Account
          </button>
        </div>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={styles.submitBtn}
            disabled={loading}
          >
            {loading ? "Authenticating..." : isLogin ? "Sign Into My Vault" : "Register and Open Account"}
          </button>
        </form>

        <div style={styles.footer}>
          <p style={styles.footerText}>
            Secured by bank-grade AES end-to-end token integrity.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "36px 32px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: "28px",
  },
  logo: {
    marginBottom: "12px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "800",
    letterSpacing: "0.05em",
    color: "var(--text-main)",
  },
  subtitle: {
    fontSize: "12px",
    color: "var(--text-muted)",
    marginTop: "4px",
  },
  tabContainer: {
    display: "flex",
    marginBottom: "24px",
    borderBottom: "1px solid var(--input-border)",
  },
  tab: {
    flex: 1,
    background: "transparent",
    border: "none",
    padding: "12px",
    fontSize: "14px",
    cursor: "pointer",
    outline: "none",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  errorAlert: {
    background: "var(--danger-glow)",
    color: "var(--danger)",
    border: "1px solid rgba(244, 63, 94, 0.2)",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "13px",
    marginBottom: "18px",
    textAlign: "center",
  },
  submitBtn: {
    marginTop: "8px",
    width: "100%",
    justifyContent: "center",
    padding: "12px",
    fontSize: "14px",
  },
  footer: {
    marginTop: "28px",
    textAlign: "center",
  },
  footerText: {
    fontSize: "11px",
    color: "var(--text-muted)",
  }
};

export default Auth;
