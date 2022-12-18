import React from 'react'

import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { ApolloProvider } from '@apollo/react-hooks'
import { setContext } from 'apollo-link-context'

import { App } from './App'



// create apollo client in these 3 steps

// 1
const httpLink = createHttpLink({
  uri: 'https://pacific-brushlands-99720.herokuapp.com/'
})

// 2
// need to use apollo-link-context so that whenever you try to create a post, the jwt token that is located in localStorage is automatically sent in the Authorization header
const authLink = setContext(() => {
  // get the jwt token from localStorage
  const token = localStorage.getItem('jwtToken')

  // return an object that has a headers property
  // the headers property is itself an object with an Authorization property, here we check if the token exists, if it does, then we send it in the authorization header, if not, we send an empty string 
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

// 3
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})



// if you have the chrome extention 'Apollo Client Devtools' downloaded, you'll see a tab called apollo in the chrome devtools, here you can literally execute queries and mutations just like you did in the backend
// if the queries and mutations from the backend work, you know the client has been successfully connected to the server



export default (
  <ApolloProvider client={client}>

    {/* every element inside the authProvider will have access to all the variables and functions we defined in the context, this is an easy way to have a global state and also global functions */}
    
    <App />
  </ApolloProvider>
)
