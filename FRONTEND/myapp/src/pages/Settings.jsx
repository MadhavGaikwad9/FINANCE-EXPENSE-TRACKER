import React from "react";

function Settings() {
  return (
    <div className="container py-5">
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4">
            <h1 className="h3 mb-4">Account settings</h1>
            <form className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Notification email</label>
                <input className="form-control" type="email" defaultValue="john@financeflow.app" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Preferred currency</label>
                <select className="form-select">
                  <option>INR</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Theme</label>
                <select className="form-select">
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Language</label>
                <select className="form-select">
                  <option>English</option>
                  <option>हिंदी</option>
                </select>
              </div>
              <div className="col-12">
                <button className="btn btn-primary">Save settings</button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="mb-3">Security</h5>
            <p className="text-muted">
              Configure password controls, multi-factor authentication, and session management for your account.
            </p>
            <button className="btn btn-outline-secondary">Manage security</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
