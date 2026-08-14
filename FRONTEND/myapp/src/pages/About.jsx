import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-5">About Finance Flow</h1>
        <p className="lead text-muted">
          Finance Flow is designed to help you make smarter decisions with your money through clean budgeting, powerful transaction tracking, and intuitive reports.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h3 className="card-title">Built for daily finance</h3>
              <p className="card-text text-muted">
                A reliable dashboard that keeps all your spending, incomes, and budget goals easy to access in one place.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-body">
              <h3 className="card-title">Secure and private</h3>
              <p className="card-text text-muted">
                We use token-based authentication so your financial data stays protected while still being quick and responsive.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-5">
        <Link to="/contact" className="btn btn-primary me-2">Contact support</Link>
        <Link to="/pricing" className="btn btn-outline-secondary">See pricing</Link>
      </div>
    </div>
  );
}

export default About;
