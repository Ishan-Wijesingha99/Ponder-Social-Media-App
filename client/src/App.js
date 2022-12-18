import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { AuthProvider } from './context/auth'
import { AuthRoute } from './util/AuthRoute'

import { Navbar } from './components/Navbar'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { SinglePost } from './pages/SinglePost'
import { NotFound } from './components/NotFound'



export const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />

        <Switch>
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
          <Route exact path="*" component={NotFound} />
        </Switch>
      </Router>
    </AuthProvider>
  )
}



