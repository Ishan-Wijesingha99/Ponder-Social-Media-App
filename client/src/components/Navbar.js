import React, { useContext } from 'react'
import { Link } from 'react-router-dom'

import { AuthContext } from '../context/auth'
import logo from '../assets/logo.png'



export const Navbar = () => {

  // destructure user object and logout immediately from context
  const { user, logout } = useContext(AuthContext)



  const Navbar = user ? (
    <div className='navbar'>

      <div className='navbar-left'>
        <img
        src={logo}
        alt="navbar logo"
        className='navbar-logo'
        />

        <p id='navbar-title'>onder</p>
      </div>

      <div className='navbar-middle'>
        <Link
        to="/"
        className='username-navbar-link'
        style={{
          color: 'black'
        }}
        >
          {user.username} - Home
        </Link>
      </div>

      <div className='navbar-right'>
        <p
        className='logout-navbar-link'
        onClick={logout}
        >Logout</p>
      </div>
      
    </div>
  ) : (
    <div className='navbar'>
      
      <div className='navbar-left'>
        <img
        src={logo}
        alt="navbar logo"
        className='navbar-logo'
        />

        <p id='navbar-title'>onder</p>
      </div>

      <div className='navbar-right'>
        <Link
        to="/"
        className='home-navbar-link'
        >
          Home
        </Link>

        <Link
        to="/login"
        className='login-navbar-link'
        >
          Login
        </Link>

        <Link
        to="/register"
        className='register-navbar-link'
        >
          Register
        </Link>
      </div>
      
    </div>
  )

  return Navbar
}

