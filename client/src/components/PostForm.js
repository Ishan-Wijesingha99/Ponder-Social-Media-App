import React from 'react'

import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { useForm } from '../util/useForm'
import { FETCH_POSTS_QUERY } from '../util/graphql'



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

  // get information from your custom hook, useForm()
  const { formData, onChange, onSubmit } = useForm(createPostCallback, {
    body: ''
  })

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: formData,
    update(proxy, result) {
      // once this mutation is successful, execute the following code

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

      // then we add the new post to this array of posts
      // result.data.createPost is the new post
      // ...data.getPosts are the old posts
      // because we want to display the newest posts first, we add result.data.getPost to the start of the array
      data.getPosts = [result.data.createPost, ...data.getPosts]

      // we then need to persist this change, this is how
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })

      // reset the body once the post has been created and added to the mongoDB database
      formData.body = ''
    }
  })

  // need this function to be hoisted to the top, so use function declaration
  function createPostCallback() {
    createPost()
  }



  return (
    <>
      <form
      onSubmit={onSubmit}
      className="post-form"
      >
        <h2 className='post-form-title'>Create a post:</h2>

        <textarea
        placeholder="Hi World!"
        name="body"
        onChange={onChange}
        value={formData.body}
        error={error ? true : false}
        className='create-post-form-textarea'
        rows="3"
        style={{
          resize: 'none'
        }}
        />

        <button
        type='submit'
        className='post-form-submit-button'
        >
          Post
        </button>

        {/* this is just in case an error occurs, there is only one possible error anyway, if we try and create a post with no body */}
        {error && (
          <div
          className="post-form-error-message-list"
          >
            <p>Body must not be empty</p>
          </div>
        )}
      </form>
    </>
  )
}



