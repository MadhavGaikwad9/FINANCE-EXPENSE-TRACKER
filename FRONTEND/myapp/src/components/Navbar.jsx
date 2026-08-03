import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

function Navbar({ user, onLogout }) {
  const { dark, setDark } = useContext(ThemeContext);

  return (
    <nav className="glass-panel" style={styles.navbar}>
      <div style={styles.brand}>
        <div style={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="var(--primary)" />
            <path d="M2 17L12 22L22 17" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 12L12 17L22 12" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={styles.brandName}>FINANCE FLOW</span>
      </div>

      <div style={styles.actions}>
        <button
          onClick={() => setDark(!dark)}
          style={styles.themeBtn}
          title="Toggle UI Theme"
        >
          {dark ? "☀️ Light" : "🌙 Dark"}
        </button>

        {user && (
          <div style={styles.profileContainer}>
            <div style={styles.avatar}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div style={styles.profileDetails}>
              <span style={styles.userName}>{user.name}</span>
              <span style={styles.userEmail}>{user.email}</span>
            </div>
            <button onClick={onLogout} style={styles.logoutBtn}>
              Sign Out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    borderRadius: "14px",
    marginBottom: "24px",
    width: "100%",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
  },
  brandName: {
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "0.03em",
    color: "var(--text-main)",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  themeBtn: {
    background: "var(--input-bg)",
    border: "1px solid var(--input-border)",
    color: "var(--text-main)",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
    outline: "none",
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderLeft: "1px solid var(--input-border)",
    paddingLeft: "18px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "var(--primary-glow)",
    border: "1.5px solid var(--primary)",
    color: "var(--primary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
  profileDetails: {
    display: "flex",
    flexDirection: "column",
    lineHeight: "1.2",
    marginRight: "6px",
    // Hide email on smaller screens
    "@media (max-width: 600px)": {
      display: "none"
    }
  },
  userName: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--text-main)",
  },
  userEmail: {
    fontSize: "10px",
    color: "var(--text-muted)",
  },
  logoutBtn: {
    background: "var(--danger-glow)",
    color: "var(--danger)",
    border: "1px solid rgba(244, 63, 94, 0.15)",
    padding: "6px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
  }
};

export default Navbar;