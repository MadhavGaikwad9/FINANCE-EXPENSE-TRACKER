import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import About from "./pages/About";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Budget from "./pages/Budget";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

import API from "./api/axios";
import Footer from "./components/Footer";


function App() {

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const bootstrapAuth = async () => {

      const savedToken = localStorage.getItem("token");

      if (savedToken) {

        API.defaults.headers.common["Authorization"] =
          `Bearer ${savedToken}`;

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

      }

      setLoading(false);

    };


    bootstrapAuth();

  }, []);



  const handleAuthSuccess = (newToken, newUser) => {

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    API.defaults.headers.common["Authorization"] =
      `Bearer ${newToken}`;

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
      <div style={{
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center"
      }}>
        Verifying Integrity Vault...
      </div>
    );

  }



  return (

    <>

      <Routes>

        {/* Public pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/auth"
          element={
            token
              ? <Navigate to="/dashboard" />
              : <Auth onAuthSuccess={handleAuthSuccess} />
          }
        />

        {/* Protected area */}
        <Route
          path="/dashboard"
          element={
            token
              ? <Dashboard user={user} onLogout={handleLogout} />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/transactions"
          element={
            token
              ? <Transactions />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/analytics"
          element={
            token
              ? <Analytics />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/budget"
          element={
            token
              ? <Budget />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/profile"
          element={
            token
              ? <Profile />
              : <Navigate to="/login" />
          }
        />
        <Route
          path="/settings"
          element={
            token
              ? <Settings />
              : <Navigate to="/login" />
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />

    </>

  );

}


export default App;