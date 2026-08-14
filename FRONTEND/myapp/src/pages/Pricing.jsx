import React from "react";

const tiers = [
  { name: "Starter", price: "$0", description: "Personal finance tracking for one user", features: ["Transaction logging", "Budget summary", "Secure login"] },
  { name: "Growth", price: "$9.99/mo", description: "Advanced insights, recurring payment tracking, and analytics", features: ["Full dashboards", "Recurring payments", "Monthly reports"] },
  { name: "Premium", price: "$19.99/mo", description: "Complete finance management for multiple accounts", features: ["Priority support", "Extended analytics", "Custom goals"] }
];

function Pricing() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <p className="text-uppercase text-primary mb-2">Pricing</p>
        <h1 className="display-5">Choose the plan that fits your goals</h1>
      </div>

      <div className="row gy-4">
        {tiers.map((tier) => (
          <div className="col-md-4" key={tier.name}>
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h3>{tier.name}</h3>
                <p className="display-6 my-3">{tier.price}</p>
                <p className="text-muted">{tier.description}</p>
                <ul className="mb-4">
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <button className="btn btn-primary mt-auto">Select plan</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Pricing;
