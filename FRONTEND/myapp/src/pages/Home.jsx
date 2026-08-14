import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const features = [
    {
      icon: "💼",
      title: "Expense Tracking",
      description: "Record every transaction, categorize spending, and stay in control."
    },
    {
      icon: "📊",
      title: "Financial Insights",
      description: "View spending, income, and savings trends in one dashboard."
    },
    {
      icon: "🤖",
      title: "Smart Advice",
      description: "Data-driven recommendations help you cut costs and save more."
    },
    {
      icon: "🔒",
      title: "Secure Access",
      description: "JWT authentication protects your account and financial data."
    }
  ];

  return (
    <div className="bg-light">
      <header className="py-4 bg-white border-bottom">
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between">
          <div>
            <h1 className="h3 mb-1">Finance Flow</h1>
            <p className="text-muted mb-0">A polished personal finance workspace for modern budgeting.</p>
          </div>
          <div className="mt-3 mt-md-0">
            <Link to="/auth" className="btn btn-outline-primary me-2">Login</Link>
            <Link to="/auth" className="btn btn-primary">Create account</Link>
          </div>
        </div>
      </header>

      <main className="container py-5">
        <section className="row align-items-center gy-5">
          <div className="col-lg-6">
            <span className="badge bg-primary mb-3">Modern finance for everyday life</span>
            <h2 className="display-5 fw-bold">Track spending, set budgets, and improve your savings.</h2>
            <p className="lead text-muted mt-4">
              Finance Flow helps you turn your financial habits into actionable insights with a clean dashboard experience.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
              <Link to="/auth" className="btn btn-primary btn-lg">Get started</Link>
              <a href="#features" className="btn btn-outline-secondary btn-lg">See features</a>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="badge bg-success">Live balance</span>
                  <small className="text-muted">Updated now</small>
                </div>
                <h3 className="fw-bold mb-3">$8,245.00</h3>
                <p className="text-muted mb-4">Your current wallet balance after tracking expenses and income.</p>
                <div className="row g-3">
                  <div className="col-6">
                    <div className="p-3 bg-primary bg-opacity-10 rounded-4 text-center">
                      <div className="text-primary fw-semibold">Income</div>
                      <div className="h5 mt-2">$5,120</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-danger bg-opacity-10 rounded-4 text-center">
                      <div className="text-danger fw-semibold">Expenses</div>
                      <div className="h5 mt-2">$2,340</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-5">
          <div className="text-center mb-5">
            <h3 className="fw-bold">A better way to manage money.</h3>
            <p className="text-muted mb-0">From daily spend tracking to budget planning and secure access.</p>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-4 g-4">
            {features.map((feature, index) => (
              <div key={index} className="col">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center">
                    <div className="display-5 mb-3">{feature.icon}</div>
                    <h5 className="card-title">{feature.title}</h5>
                    <p className="card-text text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-5 bg-white rounded-4 shadow-sm">
          <div className="row align-items-center gy-4">
            <div className="col-md-6">
              <h4 className="fw-bold">Designed for fast financial decisions.</h4>
              <p className="text-muted">Capture transactions, set goals, and visualize progress in one clean interface.</p>
              <ul className="list-unstyled mt-4">
                <li className="mb-3"><strong>Clear budgeting</strong> to stay on track.</li>
                <li className="mb-3"><strong>Insightful analytics</strong> for every month.</li>
                <li className="mb-3"><strong>Secure authentication</strong> with token-based access.</li>
              </ul>
            </div>
            <div className="col-md-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="p-4 border rounded-4 text-center">
                    <div className="fs-1 mb-2">🏦</div>
                    <p className="mb-1 fw-semibold">Budget goals</p>
                    <small className="text-muted">Set monthly limits.</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 border rounded-4 text-center">
                    <div className="fs-1 mb-2">💡</div>
                    <p className="mb-1 fw-semibold">Smart tips</p>
                    <small className="text-muted">Improve saving habits.</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 border rounded-4 text-center">
                    <div className="fs-1 mb-2">📈</div>
                    <p className="mb-1 fw-semibold">Trend reports</p>
                    <small className="text-muted">Monitor progress over time.</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-4 border rounded-4 text-center">
                    <div className="fs-1 mb-2">🔒</div>
                    <p className="mb-1 fw-semibold">Private data</p>
                    <small className="text-muted">Secure and protected.</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 text-center">
          <h4 className="fw-bold">Ready to take control?</h4>
          <p className="text-muted mb-4">Create your account and start building better financial habits today.</p>
          <Link to="/auth" className="btn btn-primary btn-lg px-5">Start now</Link>
        </section>
      </main>
    </div>
  );
}

export default Home;
