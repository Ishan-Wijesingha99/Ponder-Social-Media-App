const { ApolloServer } = require('apollo-server')
const gql = require('graphql-tag') // installed with apollo-server npm package
// there is no need to install express because it comes installed with apollo-server npm package


const typeDefs = gql`
  type Query {
    sayHi: String!

  }

`

const resolvers = {
  Query: {
    sayHi: () => {
      console.log('Hello there')
    }
  }
}


const server = new ApolloServer({ typeDefs, resolvers })


server.listen({ port: 5000 })
.then(res => console.log(`Server is running at ${res.url}`))

