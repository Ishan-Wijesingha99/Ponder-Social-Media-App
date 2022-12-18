import React from "react";
import { Link } from "react-router-dom";



export const NotFound = () => {
  return (
    <div className="not-found-container">
      <h2 id="not-found-title">404 Error</h2>

      <p id="not-found-text">This page cannot be found. Click the button below to go Home.</p>

      <Link
      to="/"
      className="home-button"
      >
        Home
      </Link>
    </div>
  )
}