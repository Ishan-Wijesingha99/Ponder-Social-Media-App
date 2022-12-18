import React, { useReducer, createContext } from 'react'
import jwtDecode from 'jwt-decode'


// for initial state, have user property as null
const initialState = {
  user: null
}



if (localStorage.getItem('jwtToken')) {
  // if the jwt token exists in local storage, execute this code

  // need to check if token is expired
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))

  // the exp date is the unix time in seconds, need to convert it to miliseconds by multiplying by 1000
  if (decodedToken.exp * 1000 < Date.now()) {
    // if the token is expired, execute this code

    // remove token from localStorage
    localStorage.removeItem('jwtToken')

    // if the token has expired, the initial state object should remains unchanged, it should have a user property that is null, so no need to do anything
  } else {
    // if token has not expired, change the user property in initialState object to be the decodedToken
    initialState.user = decodedToken
  }
}

// set up context to be used throughout application
export const AuthContext = createContext({
  user: null,
  login: userData => {},
  logout: () => {}
})



const authReducer = (state, action) => {
  switch (action.type) {
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
    localStorage.setItem('jwtToken', userData.token)

    dispatch({
      type: 'LOGIN',
      payload: userData
    })
  }

  const logout = () => {
    // remove jwt token from local storage
    localStorage.removeItem('jwtToken')
    
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  )
}

