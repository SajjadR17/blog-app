import React from "react";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="page-not-found-err-container">
      <img src="/page-not-found.png" alt="404" className="page-not-found-img" />
      <h2 className="display">This page has gone missing.</h2>
      <button
        onClick={() => navigate("/essays")}
        className="not-found-page-back-btn"
      >
        Return to Essays
      </button>
    </div>
  );
}

export default NotFoundPage;
