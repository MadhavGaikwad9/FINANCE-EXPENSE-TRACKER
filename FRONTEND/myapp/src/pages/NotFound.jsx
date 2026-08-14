import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container py-5 text-center">
      <div className="py-5">
        <h1 className="display-4">404</h1>
        <p className="lead text-muted mb-4">Page not found. The route you requested does not exist.</p>
        <Link to="/" className="btn btn-primary">Return home</Link>
      </div>
    </div>
  );
}

export default NotFound;
