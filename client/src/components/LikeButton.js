import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BiLike } from 'react-icons/bi'

import { useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'



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



export const LikeButton = ({ user, post: { id, likeCount, likes } }) => {

  // use state to monitor if post is liked or not
  const [liked, setLiked] = useState(false)



  useEffect(() => {
    // if user is true, that means the user is logged in
    // then we loop through the likes array, and for each likeObject, we see if the username property matches user.username, if it does, true will be returned, this means the currently logged in user has already liked the post
    if (user && likes.find((like) => like.username === user.username)) {
      // if both are true, then execute the following code
      setLiked(true)
    } else {
      setLiked(false)
    }

  }, [user, likes])



  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: { postId: id }
  })

  
  
  const likeButton = user ? (
    liked ? (
      <button
      className='comment-like-button-link'
      onClick={likePost}
      style={{
        backgroundColor: 'black',
        border: '2px solid #75be5e'
      }}
      >
        <BiLike 
        size={25}
        color='#75be5e'
        />

        <p
        className='like-button-likeCount'
        style={{
          color: '#75be5e'
        }}
        >{likeCount}</p>
      </button>
    ) : (
      <button
      className='comment-like-button-link'
      onClick={likePost}
      >
        <BiLike
        size={25}
        color='black'
        />

        <p className='like-button-likeCount'>{likeCount}</p>
      </button>
    )
  ) : (
    <Link
    to="/login"
    className='comment-like-button-link'
    >
      <BiLike
      size={25}
      color='black'
      />

      <p className='like-button-likeCount'>{likeCount}</p>
    </Link>
  )

  return likeButton
}



