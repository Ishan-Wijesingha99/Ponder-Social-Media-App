import React from 'react';

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'

import { BrowserRouter as Router, Route} from 'react-router-dom'

import 'semantic-ui-css/semantic.min.css'
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Register } from '../pages/Register';



// create apollo client in these 3 steps
const httpLink = createHttpLink({
  uri: 'http://localhost:5000'
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})




// if you have the chrome extention 'Apollo Client Devtools' downloaded, you'll see a tab called apollo in the chrome devtools, here you can literally execute queries and mutations just like you did in the backend
// if the queries and mutations from the backend work, you know the client has been successfully connected to the server


export const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Route exact path='/' component={<Home />}/>
        <Route exact path='/login' component={<Login />}/>
        <Route exact path='/register' component={<Register />}/>
      </Router>
    </ApolloProvider>
  )
}