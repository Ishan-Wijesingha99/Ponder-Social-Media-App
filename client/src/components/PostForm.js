import React, { useState } from "react";

import { Form, Button } from "semantic-ui-react";

import { gql } from "graphql-tag";
import { useMutation } from "@apollo/client";



const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`



export const PostForm = () => {

  const [formData, setFormData] = useState({
    body: ''
  })



  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: formData,
    update: (_, result) => {
      // once this mutation is successful, execute the following code

      console.log(result)

      // reset the body once the post has been created and added to the mongoDB database
      setFormData({
        body: ''
      })

    }
  })



  const handleInputChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const handleSubmit = () => {

  }

  return (
    <Form
    onSubmit={handleSubmit}
    >

      <h2>Create a post:</h2>

      <Form.Field>

        <Form.Input
        placeholder="Type post here..."
        name="body"
        onChange={handleInputChange}
        value={formData.body}
        />

        <Button
        type="submit"
        color="teal"
        >
          Submit  
        </Button>

      </Form.Field>

    </Form>
  )
}