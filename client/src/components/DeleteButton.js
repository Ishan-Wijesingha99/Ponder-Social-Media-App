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



export const DeleteButton = ({ postId, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false)


  const [deletePost] = useMutation(DELETE_POST_MUTATION, {
    update(proxy) {
      // if the post has been deleted successfully from the database by using the DELETE_POST_MUTATION, via the deletePost() function, the following code will be executed

      // now that post has been deleted, close confirm modal window
      setConfirmOpen(false)



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


      
      // once the post has been deleted, you need to navigate back to the home page, use the callback that you prop drilled into this deleteButton component
      if(callback) callback()
    },
    variables: {
      postId: postId
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
      onConfirm={deletePost}
      />
    </>
  )
}