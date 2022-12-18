import React, { useContext, useState } from 'react'
import { FaComments } from 'react-icons/fa'

import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'

import moment from 'moment'

import { AuthContext } from '../context/auth'
import { LikeButton } from '../components/LikeButton'
import { DeleteButton } from '../components/DeleteButton'



const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`



export const SinglePost = props => {

  const postId = props.match.params.postId

  const { user } = useContext(AuthContext)

  const [comment, setComment] = useState('')

  const { data: { getPost } } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  })



  const [createComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      // once a comment has been created in the database via the CREATE_COMMENT_MUTATION, we need to reset the body of the comment input field to an empty string
      setComment('')
    },
    variables: {
      postId,
      body: comment
    }
  })



  const onSubmitFunction = event => {
    // prevent the default reloading of the page
    event.preventDefault()

    // create comment in backend
    createComment()
  }

  function deletePostCallback() {
    props.history.push('/')
  }



  let postMarkup

  if (!getPost) {
    postMarkup = <p id='single-post-loading'>Loading post..</p>
  } else {

    const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = getPost

    postMarkup = (
      <div className='single-post-container'>
        <div className='postcard'>

          <p className='postcard-username'>{username}</p>

          <p className='postcard-time'>{moment.unix(createdAt/1000).fromNow()}</p>

          <span className='postcard-span'></span>

          <p className='postcard-body'>{body}</p>

          <span className='postcard-span'></span>

          <div className='postcard-button-section'>

            {/* like button */}
            <LikeButton
            user={user}
            post={{ id, likeCount, likes }}
            />
            
            {/* comment button */}
            <div
            className="comment-like-button-link"
            onClick={() => document.querySelector('.create-comment-textarea').focus()}
            >
              <FaComments
              size={25}
              color='black'
              />

              <p
              className='comment-button-commentCount'
              >
                {commentCount}
              </p>
            </div>

            {/* delete button */}
            {/* if user is true, we are logged in */}
            {/* if user.username === username, that means the post belongs to the currently logged in user */}
            {/* if both of these are true, only then render the delete button */}
            {user && user.username === username && (
              <DeleteButton
              postId={id}
              callback={deletePostCallback}
              />
            )}

          </div>

        </div>
        
        {/* post comment section */}
        {/* if user is true, that means the user is logged in, therefore this input should be rendered so that they can comment */}
        {user && (
          <div className='write-comment-section'>

            <p id='post-comment-title'>Post a comment</p>

            <form className='post-comment-form'>

              <textarea
                type="text"
                placeholder="Comment..."
                name="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                className="create-comment-textarea"
                rows="4"
                style={{
                  resize: 'none'
                }}
              />

              <button
                type="submit"
                className="form-submit-button"
                disabled={comment.trim() === ''}
                onClick={onSubmitFunction}
              >
                Submit
              </button>

            </form>

          </div>
        )}
        
        {/* all comments section */}
        <div className='comments-section'>

          {
          comments.map(comment => (
            <div
            className='individual-comment'
            key={comment.id}
            >

              <p id='comment-username'>{comment.username}</p>

              <p id='comment-time'>{moment.unix(createdAt/1000).fromNow()}</p>

              <span className='postcard-span'></span>

              <p id='comment-body'>{comment.body}</p>

              <span
              className='postcard-span'
              id='last-comment-span'
              ></span>

              {user && user.username === comment.username && (

                <DeleteButton
                postId={id}
                commentId={comment.id}
                />

              )
              }

            </div>
          ))
          }

        </div>

      </div>
    )
  }

  return postMarkup
}



