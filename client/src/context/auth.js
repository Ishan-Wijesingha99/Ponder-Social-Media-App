import React, { createContext, useReducer } from "react";

import jwtDecode from 'jwt-decode'



const initialState = {
  user: null
}



if(localStorage.getItem('token')) {
  // if the jwt token exists in local storage, execute this code

  // need to check if token is expired
  const decodedToken = jwtDecode(localStorage.getItem('token'))
  
  // the exp date is the unix time in seconds, need to convert it to miliseconds by multiplying by 1000
  if(decodedToken.exp * 1000 < Date.now()) {
    // if the token is expired, execute this code
    
    // remove token from localStorage
    localStorage.removeItem('token')

    // if the token has expired, the initial state object should remains unchanged, it should have a user property that is null, so no need to do anything
  } else {
    // if token has no expired, change the user property in initialState object to be the decodedToken
    initialState.user = decodedToken
  }

}




export const AuthContext = createContext({
  user: null,
  login: userData => {},
  logout: () => {}
})



const authReducer = (state, action) => {
  switch(action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null
      }
    default:
      return state
  }
}

export const AuthProvider = props => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const login = userData => {
    // save the jwt token to local storage
    localStorage.setItem('token', userData.token)

    dispatch({
      type: 'LOGIN',
      payload: userData
    })
  }

  const logout = () => {
    // remove jwt token from local storage
    localStorage.removeItem('token')

    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider
      value={{ 
        user: state.user,
        login,
        logout
      }}
      {...props}
    />
  )
}