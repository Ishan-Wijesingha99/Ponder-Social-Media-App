import React from "react";
import { useQuery } from '@apollo/client'

import { gql } from 'graphql-tag'

import { Grid } from "semantic-ui-react";


import { PostCard } from '../components/PostCard'



const FETCH_POST_QUERY = gql`
  query {
    getPosts {
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



export const Home = () => {
  // loading is a boolean which you can use to set up a loading screen/component
  // data is an object that has only one property, the getPosts property, which is an array
  // do not deconstruct the getPosts property out of the data object, it leads to bugs
  const { loading, data } = useQuery(FETCH_POST_QUERY)



  return (
    <Grid columns={3}>

      <Grid.Row id="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>

      <Grid.Row>
        {
          loading 
          ? 
          (
            <h2>Loading posts...</h2>
          )
          :
          (
            data && data.getPosts.map(postObject => (
              <Grid.Column
              key={postObject.id}
              style={{ marginBottom: 20 }}
              >
                <PostCard postObject={postObject}/>
              </Grid.Column>
            ))
          )
        }
      </Grid.Row>

    </Grid>
  )
}