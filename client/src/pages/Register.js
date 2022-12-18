import React, { useContext, useState } from 'react'

import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import { AuthContext } from '../context/auth'
import { useForm } from '../util/useForm'
import { AlreadyLoggedIn } from '../components/AlreadyLoggedIn'



const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`



export const Register = props => {

  const context = useContext(AuthContext)

  const [errors, setErrors] = useState({})

  const { onChange, onSubmit, formData } = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // the update function will be triggered if the mutation is successful
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, { data: { register: userData } }) {
      // if addUser() was successful, then execute the following code

      // even though we are registering, the login function attached to the context can be used for both registering and logging in
      // by this point in the code, we've added the user information to the backend database, now we just log the user in using that information
      context.login(userData)

      // finally, redirect to the homepage
      props.history.push('/')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: formData
  })



  // need function to be hoisted so use function declaration
  function registerUser() {
    addUser()
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
          className='register-form'
          >
            <h1 className='register-form-title'>Register</h1>

            <label
            htmlFor="Username"
            className='input-label'
            >
              Username
            </label>
            <input
            type="text"
            label="Username"
            placeholder="Username..."
            name="username"
            value={formData.username}
            // error={errors.username ? true : false}
            error={errors.username ? "true" : "false"}
            onChange={onChange}
            className='login-input-field'
            />

            <label
            htmlFor="Email"
            className='input-label'
            >
              Email
            </label>
            <input
            type="text"
            label="Email"
            placeholder="Email..."
            name="email"
            value={formData.email}
            // error={errors.email ? true : false}
            error={errors.email ? "true" : "false"}
            onChange={onChange}
            className='login-input-field'
            />

            <label
            htmlFor="Password"
            className='input-label'
            >
              Password
            </label>
            <input
            type="password"
            label="Password"
            placeholder="Password..."
            name="password"
            value={formData.password}
            // error={errors.password ? true : false}
            error={errors.password ? "true" : "false"}
            onChange={onChange}
            className='login-input-field'
            />

            <label
            htmlFor="Confirm Password"
            className='input-label'
            >
              Confirm Password
            </label>
            <input
            type="password"
            label="Confirm Password"
            placeholder="Confirm Password..."
            name="confirmPassword"
            value={formData.confirmPassword}
            // error={errors.confirmPassword ? true : false}
            error={errors.confirmPassword ? "true" : "false"}
            onChange={onChange}
            className='login-input-field'
            />

            <button
            type='submit'
            className='form-submit-button'
            >
              Register
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