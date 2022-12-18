const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')



module.exports = (context) => {
  const authHeader = context.req.headers.authorization
  
  if (authHeader) {
    // if you reach this line of code, authHeader does exist
    const token = authHeader.split('Bearer ')[1]

    if (token) {

      // execute if token exists
      try {
        const user = jwt.verify(token, SECRET_KEY)
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token')
      }

    }

    // if token does not exist, throw an error
    throw new Error("Authentication token must be 'Bearer [token]")
  }
  
  // if authHeader does not exist, throw an error
  throw new Error('Authorization header must be provided')
}
