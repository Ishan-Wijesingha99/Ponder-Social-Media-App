import React, { useContext } from 'react'
import { Route, Redirect } from 'react-router-dom'

import { AuthContext } from '../context/auth'



// this component is created so that if the user is logged in, we make it so they cannot access the login and register page, we do this by instantly redirecting them to the home page if they are logged in
export const AuthRoute = ({ component: Component, ...rest }) => {

  // if user is logged in, user variable will be truthy, if not, user will be null
  const { user } = useContext(AuthContext)

  return (
    <Route
      {...rest}
      render={props =>
        user ? <Redirect to="/" /> : <Component {...props} />
      }
    />
  )
}

