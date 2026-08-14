import React from "react";

function Contact() {
  return (
    <div className="container py-5">
      <div className="row align-items-center g-5">
        <div className="col-lg-6">
          <h1>Get in touch</h1>
          <p className="text-muted">
            Need help with your account, want to ask about a feature, or want to share feedback? We are ready to help.
          </p>
          <div className="mb-3">
            <strong>Email</strong>
            <p className="mb-0">support@financeflow.app</p>
          </div>
          <div>
            <strong>Phone</strong>
            <p className="mb-0">+1 (800) 123-4567</p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm p-4">
            <h4 className="mb-4">Send us a message</h4>
            <form>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" type="text" placeholder="Your name" />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input className="form-control" type="email" placeholder="you@example.com" />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea className="form-control" rows="5" placeholder="How can we help?"></textarea>
              </div>
              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
