import React from "react";

import { Link } from "react-router-dom";



export const AlreadyLoggedIn = () => {
  return (
    <div id="logged-in-container">

      <h2 id="already-logged-in-text">You are already logged in!</h2>

      <Link to='/' id="logged-in-button">
        Home
      </Link>
      
    </div>
  )
}