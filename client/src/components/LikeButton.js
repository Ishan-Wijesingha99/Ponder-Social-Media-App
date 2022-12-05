import React, { useEffect, useState } from "react";

import { Button, Icon, Label } from "semantic-ui-react";

import { Link } from "react-router-dom";

import { useMutation } from "@apollo/client";

import { gql } from 'graphql-tag'



const LIKE_POST_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      likes {
        id
        username
      }
      likeCount
    }
  }
`



export const LikeButton = ({ id, likes, likeCount, user }) => {
  const [liked, setLiked] = useState(false)



  useEffect(() => {
    // if user is true, that means the user is logged in
    // then we loop through the likes array, and for each likeObject, we see if the username property matches user.username, if it does, true will be returned, this means the currently logged in user has already liked the post
    if(user && likes.find(likeObject => likeObject.username === user.username)) {
      // if both are true, then execute the following code
      setLiked(true)
    } else {
      setLiked(false)
    }

  }, [user, likes])



  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id}
  })



  let likeButton

  if(user) {

    if(liked) {
      likeButton = (
        <Button color='teal'>
          <Icon name='heart' />
          Like
        </Button>
      )
    } else {
      likeButton = (
        <Button color='teal' basic>
          <Icon name='heart' />
          Like
        </Button>
      )
    }

  } else {

    likeButton = (
      <Button as={Link} to="/login" color='teal' basic>
        <Icon name='heart' />
        Like
      </Button>
    )

  }



  return (
    <Button
      as='div'
      labelPosition='right'
      onClick={likePost}
    >

      {likeButton}
      
      <Label basic color='teal' pointing='left'>
        {likeCount}
      </Label>

    </Button>
  )
}