import React, { useContext, useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'
import { useForm } from '../util/useForm'
import { AlreadyLoggedIn } from '../components/AlreadyLoggedIn'



const LOGIN_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      email
      username
      createdAt
      token
    }
  }
`



export const Login = props => {

  const context = useContext(AuthContext)

  const [errors, setErrors] = useState({})

  const { onChange, onSubmit, formData } = useForm(loginUserCallback, {
    username: '',
    password: ''
  })

  // the update function will be triggered if the mutation is successful
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, { data: { login: userData } }) {
      // if loginUser() was successful, then execute the following code

      // use login function which is attached to the context
      context.login(userData)

      // finally, redirect to the homepage
      props.history.push('/')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: formData
  })



  // need function to be hoisted, so use function declaration
  function loginUserCallback() {
    loginUser()
  }



  return (
    <div className='form-container'>

      {
        // render form if token doesn't exist in local storage, render button to take user back to homepage if it already exists
        localStorage.getItem('token')

        ?

        (
          <AlreadyLoggedIn />
        )

        :

        (
          <form
          onSubmit={onSubmit}
          noValidate
          className='login-form'
          >

            <h1 className='login-form-title'>Login</h1>

            <label
            htmlFor="Username"
            className='input-label'
            >
              Username
            </label>
            <input
            className='login-input-field'
            type="text"
            label="Username"
            placeholder="Username..."
            name="username"
            value={formData.username}
            error={errors.username ? true : false}
            onChange={onChange}
            />

            <label
            htmlFor="Password"
            className='input-label'
            >
              Password
            </label>
            <input
            className='login-input-field'
            label="Password"
            placeholder="Password..."
            name="password"
            type="password"
            value={formData.password}
            error={errors.password ? true : false}
            onChange={onChange}
            />

            <button
            type='submit'
            className='form-submit-button'
            >
              Login
            </button>

          </form>
        )

      }

      {/* when form is submitted, render this element while loading */}
      { loading && (
        <div className='loading-form-submission'>Loading...</div>
      )}

      {/* this will only be rendered if there are properties in the error object, which is only possible if the form is being rendered, so you don't need to worry about this component being rendered if the form isn't also rendered */}
      {
      Object.keys(errors).length > 0 && (
        <ul className="error-message-list">
          {Object.values(errors).map(error => (
            <li
            key={error}
            className="error-message-li"
            >
              {error}
            </li>
          ))}
        </ul>
      )
      }

    </div>
  )
}

