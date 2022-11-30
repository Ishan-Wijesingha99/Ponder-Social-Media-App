import React, { useState, useContext } from "react";

import { Button, Form } from "semantic-ui-react";

import { useMutation } from "@apollo/client";
import { gql } from 'graphql-tag'

import { AuthContext } from "../context/auth";



const LOGIN_USER = gql`
  mutation login(
    $email: String!
    $password: String!
  ) {
    login(
      email: $email,
      password: $password,
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`



export const Login = () => {
  const context = useContext(AuthContext)

  const [errors, setErrors] = useState({})

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  // the update function will be triggered if the mutation is successful
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    update(_, result) {
      // if loginUser() was successful, then execute the following code
      console.log(result)

      // use login function which is attached to the context
      // result.data.login is the userData
      context.login(result.data.login)



      
      // finally, redirect to the homepage by changing the url to '/'
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
    loginUser()
  }



  return (
    <div className="form-container-div">
      <Form
      onSubmit={onSubmit}
      noValidate
      className={loading ? 'loading' : ''}
      >

        <h1>Login</h1>

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

        <Button type="submit" primary>
          Login
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