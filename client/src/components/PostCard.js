import React from "react";

import { Card, Icon, Label, Image, Button } from 'semantic-ui-react'

import moment from 'moment'



export const PostCard = ({ postObject: { body, createdAt, id, username, likeCount, commentCount, likes }}) => {

  // we need to convert the Date.now() time, which is just the unix time, to the format shown in the tutorial video
  console.log(createdAt)
  // const date1 = new Date(createdAt)
  // console.log(date1)
  // console.log(new Date(createdAt).toISOString())
  // console.log(createdAt.toISOString())



  return (
    <Card>

      <Card.Content>
        <Image
          floated='right'
          size='mini'
          src='https://react.semantic-ui.com/images/avatar/large/molly.png'
        />

        <Card.Header>{username}</Card.Header>

        <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>

        <Card.Description>
          {body}
        </Card.Description>

      </Card.Content>

      <Card.Content extra>
        <p>buttons here</p>
      </Card.Content>

    </Card>
  )
}