// import dotenv so that you can store your secret key on your device and you're device only (server)
require('dotenv').config()



const User = require('../../models/User')



const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')



module.exports = {

  Mutation: {
    // it goes (parent, args, context, info)
    // args is just the input you put into your typeDefs
    // register(registerInput: RegisterInput): User!
    // it's RegisterInput from above
    // we are going to destructure it straight away for ease
    register: async (parent, { registerInput: { username, email, password, confirmPassword }}, context, info) => {
      // validate form data, this is where we check if the username has already been taken, if the password and confirmPassword matches, if the email is the correct form using a Regex expression etc etc

      // make sure user doesn't already exist

      // hash password and create an authentication token
      hashedPassword = await bcrypt.hash(password, 12)

      // create new user on User model with the hashed password
      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        createdAt: Date.now()
      })

      // save that new user to the database
      const res = await newUser.save()

      // create jwt token
      const token = jwt.sign({
        id: res.id,
        email: res.email,
        username: res.username
      }, process.env.SIGN_TOKEN_SECRET_KEY, { expiresIn: '1h'})

      return {
        ...res._doc,
        id: res._id,
        token
      }
    }
  }

}