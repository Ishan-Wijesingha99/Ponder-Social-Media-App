import React, { useState, useContext } from "react";

import { Button, Form } from "semantic-ui-react";

import { useMutation } from "@apollo/client";
import { gql } from 'graphql-tag'

import { AuthContext } from "../context/auth";



const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username,
        email: $email,
        password: $password,
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



export const Register = () => {
  const context = useContext(AuthContext)



  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  // the update function will be triggered if the mutation is successful
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update(_, result) {
      // if addUser() was successful, then execute the following code
      console.log(result)

      // even though we are registering, the login function attached to the context can be used for both registering and logging in
      context.login(result.data.register)

      
      // finally, redirect to the home page by changing the url to home page
      window.location.href = '/'
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.fields)
      console.log(errors)
    },
    variables: formData
  })



  const changeFormData = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const onSubmit = event => {
    event.preventDefault()

    // no need to validate form data because we've already done server side validation, no point validating on the client as well

    // so just use the addUser mutation
    addUser()
  }



  return (
    <div className="form-container-div">
      <Form
      onSubmit={onSubmit}
      noValidate
      className={loading ? 'loading' : ''}
      >

        <h1>Register</h1>

        <Form.Input 
          type="text"
          label="Username"
          placeholder="Username..."
          name="username"
          value={formData.username}
          error={errors.username ? true : false}
          onChange={changeFormData}
        />

        <Form.Input
          type="email"
          label="Email"
          placeholder="Email..."
          name="email"
          value={formData.email}
          error={errors.email ? true : false}
          onChange={changeFormData}
        />

        <Form.Input
          type="password"
          label="Password"
          placeholder="Password..."
          name="password"
          value={formData.password}
          error={errors.password ? true : false}
          onChange={changeFormData}
        />

        <Form.Input
          type="password"
          label="Confirm Password"
          placeholder="Confirm Password..."
          name="confirmPassword"
          value={formData.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={changeFormData}
        />

        <Button type="submit" primary>
          Register
        </Button>

      </Form>

      {
        Object.keys(errors).length > 0 && (

          <div className="ui error message">
            <ul className="list">

              {Object.values(errors).map(errorString => (
                <li key={errorString}>{errorString}</li>
              ))}
              
            </ul>
          </div>

        )
      }

    </div>
  )
}