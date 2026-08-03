import React, { useEffect, useState } from "react";
import socket from "../socket/socket";

function Notification({ userId }) {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Join room for real-time alerts
    socket.emit("joinRoom", userId);

    const handleNotification = (message) => {
      const id = Date.now();
      
      // Add new toast
      setToasts((prev) => [...prev, { id, message }]);

      // Auto dismiss after 5 seconds
      setTimeout(() => {
        removeToast(id);
      }, 5000);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [userId]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div style={styles.toastContainer}>
      {toasts.map((t) => (
        <div
          key={t.id}
          className="glass-panel animate-fade-in"
          style={styles.toast}
        >
          <div style={styles.alertIcon}>⚠️</div>
          <div style={styles.content}>
            <p style={styles.message}>{t.message}</p>
            <span style={styles.stamp}>Just now</span>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            style={styles.closeBtn}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  toastContainer: {
    position: "fixed",
    top: "24px",
    right: "24px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "320px",
    maxWidth: "calc(100vw - 48px)",
  },
  toast: {
    padding: "16px",
    borderRadius: "12px",
    display: "flex",
    gap: "12px",
    alignItems: "flex-start",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    borderLeft: "4px solid var(--danger)",
    animation: "slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
  },
  alertIcon: {
    fontSize: "18px",
    lineHeight: "1.2",
  },
  content: {
    flex: 1,
  },
  message: {
    fontSize: "13px",
    fontWeight: "600",
    color: "var(--text-main)",
    lineHeight: "1.4",
  },
  stamp: {
    fontSize: "9px",
    color: "var(--text-muted)",
    marginTop: "4px",
    display: "block",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    fontSize: "18px",
    cursor: "pointer",
    lineHeight: "1",
    padding: "0 2px",
  }
};

// Insert keyframe slideIn for toasts
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default Notification;