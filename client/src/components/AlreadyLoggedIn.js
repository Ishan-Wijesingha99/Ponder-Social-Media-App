import React from "react";

import { Button } from "semantic-ui-react";

import { Link } from "react-router-dom";



export const AlreadyLoggedIn = () => {
  return (
    <div id="logged-in-container">
      <h2>You are already logged in!</h2>

      <Link to='/' id="logged-in-button">
        <Button primary>Home</Button>
      </Link>
    </div>
  )
}