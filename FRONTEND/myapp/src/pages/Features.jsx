import React from "react";

const featureCards = [
  { title: "Expense Tracking", description: "Log spending instantly and categorize every transaction." },
  { title: "Budget Planning", description: "Set monthly limits and stay on top of your cash flow." },
  { title: "Analytics", description: "Visualize trends so you can adjust habits before overspending." },
  { title: "Secure Access", description: "Protect your account with modern JWT authentication." }
];

function Features() {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <p className="text-uppercase text-primary mb-2">Features</p>
        <h1 className="display-5">Everything you need to manage your money in one place</h1>
      </div>

      <div className="row g-4">
        {featureCards.map((feature, index) => (
          <div className="col-sm-6" key={index}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h4>{feature.title}</h4>
                <p className="text-muted">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
