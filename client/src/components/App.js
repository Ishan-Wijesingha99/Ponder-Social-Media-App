import React from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from 'apollo-link-context'

import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css'

import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { SinglePost } from '../pages/SinglePost'
import { MenuBar } from './MenuBar';

import { AuthProvider } from '../context/auth';



// create apollo client in these 3 steps



// 1
const httpLink = createHttpLink({
  uri: 'http://localhost:5000'
})



// 2
// need to use apollo-link-context so that whenever you try to create a post, the jwt token that is located in localStorage is automatically sent in the Authorization header
const authLink = setContext(() => {
  // get the jwt token from localStorage
  const token = localStorage.getItem('token')

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



export const App = () => {
  return (
    <ApolloProvider client={client}>

      {/* every element inside the authProvider will have access to all the variables and functions we defined in the context, this is an easy way to have a global state and also global functions */}
      <AuthProvider>

        <Router>
          <div className='wrapper-div'>
            <MenuBar />

            <Routes>
              <Route path='/' element={<Home />}/>
              <Route path='/login' element={<Login />}/>
              <Route path='/register' element={<Register />}/>
              <Route path='/posts/:postId' element={<SinglePost />}/>
            </Routes>
          </div>
        </Router>

      </AuthProvider>

    </ApolloProvider>
  )
}