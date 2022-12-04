import React, { useContext } from "react";

import { Card, Icon, Label, Image, Button } from 'semantic-ui-react'

import moment from 'moment'

import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";



export const PostCard = ({ postObject: { body, createdAt, id, username, likeCount, commentCount, likes }}) => {

  const { user } = useContext(AuthContext)



  const likePost = () => {
    console.log('Post liked!')
  }



  return (
    <Card fluid>

      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />

        <Card.Header>{username}</Card.Header>

        <Card.Meta
          as={Link}
          to={`/posts/${id}`}
        >
          {moment.unix(createdAt/1000).fromNow()}
        </Card.Meta>

        <Card.Description>
          {body}
        </Card.Description>

      </Card.Content>



      <Card.Content extra>

        {/* like button section */}
        <Button
          as='div'
          labelPosition='right'
          onClick={likePost}
        >

          <Button color='teal' basic>
            <Icon name='heart' />
            Like
          </Button>
          
          <Label basic color='teal' pointing='left'>
            {likeCount}
          </Label>

        </Button>

        {/* comment button section */}
        <Button
          labelPosition='right'
          as={Link}
          to={`/posts/${id}`}
        >

          <Button color='blue' basic>
            <Icon name='comments' />
            Comment
          </Button>
          
          <Label basic color='blue' pointing='left'>
            {commentCount}
          </Label>

        </Button>

        {/* delete button */}
        {/* if user is true, we are logged in */}
        {/* if user.username === username, that means the post belongs to the currently logged in user */}
        {/* if both of these are true, only then render the delete button */}
        {user && user.username === username && (
          <Button
          as="div"
          color="red"
          onClick={() => console.log('Delete post')}
          floated="right"
          >
            <Icon
            name="trash"
            style={{ margin: 0 }}
            />
          </Button>
        )}

      </Card.Content>

    </Card>
  )
}