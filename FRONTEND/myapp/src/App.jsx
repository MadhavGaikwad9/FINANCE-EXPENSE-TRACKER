import React, { useState, useEffect } from "react";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import API from "./api/axios";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        // Set Axios default token
        API.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        try {
          const res = await API.get("/auth/me");
          if (res.data.success) {
            setUser(res.data.user);
            setToken(savedToken);
          } else {
            handleLogout();
          }
        } catch (err) {
          console.error("Session verification failed:", err);
          handleLogout();
        }
      } else {
        handleLogout();
      }
      setLoading(false);
    };

    bootstrapAuth();
  }, [token]);

  const handleAuthSuccess = (newToken, newUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    API.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete API.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div className="glass-panel" style={styles.loaderCard}>
          <div style={styles.spinner}></div>
          <p style={styles.loaderText}>Verifying Integrity Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {!token ? (
        <Auth onAuthSuccess={handleAuthSuccess} />
      ) : (
        <Dashboard user={user} setUser={setUser} onLogout={handleLogout} />
      )}
    </>
  );
}

const styles = {
  loaderContainer: {
    display: "flex",
    height: "100vh",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderCard: {
    padding: "30px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(99, 102, 241, 0.1)",
    borderTop: "3px solid var(--primary)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loaderText: {
    fontSize: "14px",
    color: "var(--text-muted)",
    fontWeight: "500",
  }
};

// Add standard keyframe spin for CSS dynamically if needed, or index.css covers it
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default App;