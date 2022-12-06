import React, { useState } from "react";

import { gql } from "graphql-tag";

import { useMutation } from "@apollo/client";

import { Button, Icon, Confirm } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../pages/Home";



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



export const DeleteButton = ({ postId, callback, commentId }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)

  // if commentId is passed down as a prop to this DeleteButton component, that means this delete button is being used to delete a comment, not a post
  // therefore, if commentId is true, the mutation should be DELETE_COMMENT_MUTATION, if not, it should be DELETE_POST_MUTATION
  const dynamicMutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION



  const [deletePostOrComment] = useMutation(dynamicMutation, {
    update(proxy) {
      // if the post/comment has been deleted successfully from the database, via the deletePostOrComment() function, the following code will be executed

      // now that post/comment has been deleted, close confirm modal window
      setConfirmOpen(false)



      // if the delete button is used to delete a post, then execute the following code
      if(!commentId) {

        // Remove post from cache so that the deletion of the post is reflected on the frontend without having to reload the page
        const data = proxy.readQuery({
          query: FETCH_POSTS_QUERY
        })

        const cachePostData = { ...data }

        cachePostData.getPosts = cachePostData.getPosts.filter(postObject => postObject.id !== postId)

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: cachePostData
        })

      }

    

      // once the post/comment has been deleted, you need to navigate back to the home page, use the callback that you prop drilled into this deleteButton component
      if(callback) callback()
    },
    variables: {
      postId: postId,
      commentId: commentId
    }
  })



  return (
    <>
      <Button
      as="div"
      color="red"
      onClick={() => setConfirmOpen(true)}
      floated="right"
      >
        <Icon
        name="trash"
        style={{ margin: 0 }}
        />
      </Button>

      <Confirm
      open={confirmOpen}
      // this will happen if you click no
      onCancel={() => setConfirmOpen(false)}
      // this will happen if you click yes
      onConfirm={deletePostOrComment}
      />
    </>
  )
}