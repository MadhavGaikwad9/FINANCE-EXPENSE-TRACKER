import React from "react";

function Profile() {
  return (
    <div className="container py-5">
      <div className="row gy-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-4">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 64, height: 64 }}>
                <span className="fs-3">JF</span>
              </div>
              <div className="ms-3">
                <h4 className="mb-0">John Foster</h4>
                <p className="text-muted mb-0">Member since 2026</p>
              </div>
            </div>
            <div>
              <p className="mb-2"><strong>Email</strong></p>
              <p className="text-muted">john@financeflow.app</p>
              <p className="mb-2"><strong>Location</strong></p>
              <p className="text-muted">Bengaluru, India</p>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card shadow-sm border-0 p-4">
            <h1 className="h3 mb-3">Profile settings</h1>
            <p className="text-muted">Update your display name, email, and notification preferences.</p>
            <form className="row g-3 mt-4">
              <div className="col-md-6">
                <label className="form-label">Full name</label>
                <input className="form-control" type="text" defaultValue="John Foster" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" defaultValue="john@financeflow.app" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input className="form-control" type="tel" defaultValue="+91 98765 43210" />
              </div>
              <div className="col-12">
                <button className="btn btn-primary">Save profile</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
