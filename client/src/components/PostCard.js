import React from "react";

import { Card, Icon, Label, Image, Button } from 'semantic-ui-react'

import moment from 'moment'

import { Link } from "react-router-dom";



export const PostCard = ({ postObject: { body, createdAt, id, username, likeCount, commentCount, likes }}) => {

  const likePost = () => {
    console.log('Post liked!')
  }

  const commentOnPost = () => {
    console.log('Post commented on!')
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
          as='div'
          labelPosition='right'
          onClick={commentOnPost}
        >

          <Button color='blue' basic>
            <Icon name='comments' />
            Comment
          </Button>
          
          <Label basic color='blue' pointing='left'>
            {commentCount}
          </Label>

        </Button>

      </Card.Content>

    </Card>
  )
}