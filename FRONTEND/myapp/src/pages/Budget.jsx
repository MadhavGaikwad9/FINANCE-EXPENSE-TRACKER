import React from "react";

function Budget() {
  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h1 className="h3">Budget</h1>
              <p className="text-muted">Create, update, and track your monthly spending goals.</p>
              <div className="row gy-3 mt-4">
                <div className="col-md-6">
                  <div className="p-4 bg-light rounded-4">
                    <h5>Monthly limit</h5>
                    <p className="mb-0">₹45,000</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 bg-light rounded-4">
                    <h5>Remaining budget</h5>
                    <p className="mb-0">₹18,200</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5>Spending categories</h5>
              <ul className="list-unstyled text-muted mt-3">
                <li className="mb-2">Groceries: ₹9,450</li>
                <li className="mb-2">Utilities: ₹4,200</li>
                <li className="mb-2">Entertainment: ₹3,175</li>
                <li>Transport: ₹2,950</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Budget;
