import gql from 'graphql-tag'



// we are putting this query in it's own file because it needs to be used in multiple places
export const FETCH_POSTS_QUERY = gql`
  {
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
