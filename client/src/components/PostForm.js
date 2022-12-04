import React, { useState } from "react";

import { Form, Button } from "semantic-ui-react";

import { gql } from "graphql-tag";
import { useMutation } from "@apollo/client";

import { FETCH_POSTS_QUERY } from "../pages/Home";



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

    update: (proxy, result) => {
      // once this mutation is successful, execute the following code

      // log the result to the console so that we can see if the mutation was successful
      console.log(result)



      // once the post has been created in the mongoDB database, it won't be shown on the list of posts in the home page until we refresh the page
      // the standard way to update the page without refreshing the page is the following...

      // if you go to Apollo in chrome devtools, you can see the cache, this is where all past queries/mutations you've executed are stored
      // the returned data from there queries/mutations are there as well
      // you can actually execute a query or mutation on the data in the cache which is on the client, rather than on the backend database! Pretty cool ay!
      // this cache resets every time the page reloads, so you only have access to the queries/mutations you made before reloading page
       
      // to execute a query on the cache, we use proxy.readQuery()
      // we store the data returned from the query in a variable
      // data is an object that has a getPosts property, this getPosts property is an array, each element in the array is an object that contains all the data about each post. body, commentCount, comments, createdAt, id, likeCount, likes, username
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      })

      // the variable data, which we got from proxy.readQuery() cannot be altered, so we need to create a new object that is the exact same as data so we can change it
      // we can't just say const cachePostData = data because then cachePostData will still point to the same thing in the heap, need to create a totally new object using {} constructor
      const cachePostData = { ...data }

      // then we add the new post to this array of posts
      // result.data.createPost is the new post
      // ...cachePostData.getPosts are the old posts
      // because we want to display the newest posts first, we add result.data.getPost to the start of the array
      cachePostData.getPosts = [result.data.createPost, ...cachePostData.getPosts]

      // we then need to persist this change, this is how
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: cachePostData
      })



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
    // when the form is submitted, use the createPost mutation
    createPost()
  }

  return (
    <>
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
          error={error ? true : false}
          />

          <Button
          type="submit"
          color="teal"
          >
            Submit  
          </Button>

        </Form.Field>

      </Form>

      {/* this is just in case an error occurs, there is only one possible error anyway, if we try and create a post with no body */}
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>Body must not be empty</li>
          </ul>
        </div>
      )}
    </>
  )
}