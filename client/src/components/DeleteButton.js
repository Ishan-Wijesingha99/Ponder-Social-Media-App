import React from 'react'
import { MdOutlineDelete } from 'react-icons/md'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'

import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'

import { FETCH_POSTS_QUERY } from '../util/graphql'



export const DeleteButton = ({ postId, commentId, callback }) => {

  // if commentId is passed down as a prop to this DeleteButton component, that means this delete button is being used to delete a comment, not a post
  // therefore, if commentId is true, the mutation should be DELETE_COMMENT_MUTATION, if not, it should be DELETE_POST_MUTATION
  const dynamicMutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION

  const [deletePostOrDeleteComment] = useMutation(dynamicMutation, {
    update(proxy) {
      // if the post/comment has been deleted successfully from the database, via the deletePostOrComment() function, the following code will be executed

      // if the delete button is used to delete a post, then execute the following code
      if (!commentId) {

        // Remove post from cache so that the deletion of the post is reflected on the frontend without having to reload the page
        // fetch posts from cache
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        })

        // filter out the post we want to delete
        data.getPosts = data.getPosts.filter((p) => p.id !== postId)

        // persist the change
        proxy.writeQuery({ query: FETCH_POSTS_QUERY, data })
      }

      // once the post/comment has been deleted, you need to navigate back to the home page, use the callback that you prop drilled into this deleteButton component
      if (callback) callback()
    },
    variables: {
      postId,
      commentId
    }
  })



  // this will be executed when the delete button is clicked, a modal window will appear
  const buttonOnClick = () => {

    // confirmAlert({
    //   title: 'Confirm to delete',
    //   message: 'Are you sure you want to delete this?',
    //   buttons: [
    //     {
    //       label: 'Yes',
    //       onClick: () => deletePostOrDeleteComment()
    //     },
    //     {
    //       label: 'No',
    //       onClick: () => console.log('clicked no')
    //     }
    //   ]
    // })

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='confirm-modal-container'>

            <h1 className='confirm-modal-title'>Confirm to delete</h1>

            <p className='confirm-modal-body'>Are you sure you want to delete this?</p>

            <div className='confirm-modal-btn-container'>
              <button
              className='confirm-modal-yes'
              onClick={() => {
                // delete the post or comment
                deletePostOrDeleteComment()
                // close modal window
                onClose()
              }}
              >
                Yes
              </button>

              <button
              className='confirm-modal-no'
              onClick={onClose}
              >
                No
              </button>
            </div>
            
          </div>
        )
      }
    })

  }



  return (
    <>

      <button
      className='delete-button'
      onClick={buttonOnClick}
      >
        <MdOutlineDelete
        size={25}
        color="red"
        />
      </button>
      
    </>
  )
}



const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`

const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        createdAt
        body
      }
      commentCount
    }
  }
`