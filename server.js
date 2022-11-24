const { ApolloServer } = require('apollo-server')
const gql = require('graphql-tag') // installed with apollo-server npm package
// there is no need to install express because it comes installed with apollo-server npm package

const mongoose = require('mongoose')



const typeDefs = gql`
  type Query {
    sayHi: String!

  }

`

const resolvers = {
  Query: {
    sayHi: () => 'Hi There'
  }
}


const server = new ApolloServer({ typeDefs, resolvers })

mongoose.connect('mongodb+srv://ishanwij99:yeet981@cluster0.6n9gpsy.mongodb.net/Ponder?retryWrites=true&w=majority',
{ useNewUrlParser: true })
.then(res => console.log('Mongoose connection successful'))
.then(() => server.listen({ port: 5000 }).then(res => console.log(`Server is running at ${res.url}`)))




