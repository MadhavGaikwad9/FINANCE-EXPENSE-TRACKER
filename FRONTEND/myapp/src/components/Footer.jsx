import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light pt-5 pb-3 mt-5">
      <div className="container">
        <div className="row">

          {/* Brand */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold">Finance Tracker</h4>
            <p className="text-secondary">
              Manage your income, expenses, budgets and financial goals
              easily in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 mb-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-secondary text-decoration-none">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-secondary text-decoration-none">
                  About
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-secondary text-decoration-none">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary text-decoration-none">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Dashboard */}
          <div className="col-md-3 mb-4">
            <h5>Dashboard</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a
                  href="#"
                  className="text-secondary text-decoration-none"
                >
                  Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-secondary text-decoration-none"
                >
                  Transactions
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="#"
                  className="text-secondary text-decoration-none"
                >
                  Analytics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-secondary text-decoration-none"
                >
                  Budget
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="col-md-3 mb-4">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3">
              <a href="#" className="text-light text-decoration-none">
                GitHub
              </a>
              <a href="#" className="text-light text-decoration-none">
                LinkedIn
              </a>
              <a href="#" className="text-light text-decoration-none">
                Instagram
              </a>
            </div>
          </div>

        </div>

        <hr className="border-secondary" />

        <div className="text-center text-secondary">
          <p className="mb-0">
            © {new Date().getFullYear()} Finance Tracker. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;