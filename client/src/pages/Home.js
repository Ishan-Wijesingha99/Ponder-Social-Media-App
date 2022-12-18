import React, { useContext } from 'react'

import { useQuery } from '@apollo/react-hooks'

import { AuthContext } from '../context/auth'
import { PostCard } from '../components/PostCard'
import { PostForm } from '../components/PostForm'
import { FETCH_POSTS_QUERY } from '../util/graphql'



export const Home = () => {

  const { user } = useContext(AuthContext)

  // loading is a boolean which you can use to set up a loading screen/component
  // data is an object that has only one property, the getPosts property, which is an array
  const { loading, data } = useQuery(FETCH_POSTS_QUERY)

  // data: { getPosts: posts }
  console.log(data)

  return (
    <div className='home-container'>
      <h1 id='home-title'>Recent Posts</h1>

      {/* if the user exists, that means we are logged in, so in that case, render this form */}
      {user && (   
        <PostForm />
      )}

      {
        loading 
        
        ? 
        
        (
          <h1 id='home-loading-posts'>Loading posts..</h1>
        ) 
        
        : 
        
        (    
          <div>
            {data && data.getPosts.map(postObject => (
              <PostCard
                key={postObject.id}
                post={postObject}
              />
            ))}
          </div> 
        )
        
      }

    </div>
  )
}

