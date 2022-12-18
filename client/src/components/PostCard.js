import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { FaComments } from 'react-icons/fa'

import moment from 'moment'

import { AuthContext } from '../context/auth'
import { LikeButton } from './LikeButton'
import { DeleteButton } from './DeleteButton'



export const PostCard = ({ post: { body, createdAt, id, username, likeCount, commentCount, likes } }) => {
  
  const { user } = useContext(AuthContext)



  return (
    <div className='postcard'>
      <p className='postcard-username'>{username}</p>

      <Link
      to={`/posts/${id}`}
      className="postcard-time-link"
      >
        <p className='postcard-time'>{moment.unix(createdAt/1000).fromNow()}</p>
      </Link>

      <span className='postcard-span'></span>

      <p className='postcard-body'>{body}</p>

      <span className='postcard-span'></span>

      <div className='postcard-button-section'>
        <div className='like-and-comment-buttons'>
          {/* like button */}
          <LikeButton
          user={user}
          post={{ id, likes, likeCount }}
          />

          {/* comment button */}
          <Link
          to={`/posts/${id}`}
          className="comment-like-button-link"
          >
            <FaComments
            size={25}
            color='black'
            />

            <p className='comment-button-commentCount'>{commentCount}</p>
          </Link>
        </div>

        {/* delete button */}
        {/* if user is true, we are logged in */}
        {/* if user.username === username, that means the post belongs to the currently logged in user */}
        {/* if both of these are true, only then render the delete button */}
        {user && user.username === username && (
          <DeleteButton
          postId={id}
          />
        )}

      </div>
    </div>
  )
}

