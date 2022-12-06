import React, { useContext } from "react";

import { useParams, useNavigate } from "react-router-dom";

import { gql } from "graphql-tag";

import { useQuery } from "@apollo/client";

import { Button, Card, Grid, Image, Icon, Label } from "semantic-ui-react";

import moment from "moment";

import { LikeButton } from "../components/LikeButton";
import { DeleteButton } from "../components/DeleteButton";

import { AuthContext } from "../context/auth";



const FETCH_POST_QUERY = gql`
  query GetPost($postId: ID!) {
    getPost(postId: $postId) {
      body
      commentCount
      comments {
        body
        createdAt
        id
        username
      }
      createdAt
      id
      likeCount
      likes {
        username
      }
      username
    }
  }
`



export const SinglePost = (props) => {
  const navigate = useNavigate()
  
  const { postId } = useParams()

  const { user } = useContext(AuthContext)

  const { data } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId
    }
  })

  const deletePostCallback = () => {
    navigate('/')
  }



  let postMarkup

  if(!data?.getPost) {
    postMarkup = <p>Loading post...</p>
  } else {
    const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost

    postMarkup = (
      <Grid>

        <Grid.Row>

          <Grid.Column width={2}>
            <Image
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            size="small"
            float="right"
            />
          </Grid.Column>

          <Grid.Column width={2}>
            <Card fluid>
              <Card.Content>
                <Card.Header>
                  {username}
                </Card.Header>
                <Card.Meta>
                  {moment.unix(createdAt/1000).fromNow()}
                </Card.Meta>
                <Card.Description>
                  {body}
                </Card.Description>
              </Card.Content>

              <hr />

              <Card.Content extra>
                {/* like button */}
                <LikeButton
                user={user}
                id={id}
                likeCount={likeCount}
                likes={likes}
                />

                {/* comment button */}
                <Button
                as="div"
                labelPosition="right"
                onClick={() => console.log('comment on post')}
                >
                  <Button basic>
                    <Icon name="comments" />
                  </Button>
                  <Label basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>

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

              </Card.Content>

            </Card>
          </Grid.Column>

        </Grid.Row>

      </Grid>
    )
  }



  return postMarkup
}