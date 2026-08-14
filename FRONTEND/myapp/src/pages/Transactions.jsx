import React from "react";

function Transactions() {
  return (
    <div className="container py-5">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3">Transactions</h1>
          <p className="text-muted mb-0">Review and manage your recent spending and income entries.</p>
        </div>
        <button className="btn btn-outline-primary">Add transaction</button>
      </div>

      <div className="table-responsive shadow-sm rounded-4 overflow-hidden border">
        <table className="table mb-0">
          <thead className="table-light">
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2026-08-07</td>
              <td>Grocery shopping</td>
              <td>Food</td>
              <td>Expense</td>
              <td className="text-danger">-$68.40</td>
            </tr>
            <tr>
              <td>2026-08-06</td>
              <td>Salary deposit</td>
              <td>Income</td>
              <td className="text-success">Income</td>
              <td className="text-success">+$2,400.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
