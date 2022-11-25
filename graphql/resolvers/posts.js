const Post = require('../../models/Post')

const checkAuth = require('../../utils/checkAuth')


module.exports = {

  Query: {
    getPosts: async () => {
      try {
        // if you don't specify anything in find(), it will fetch all the documents in Post model/collection
        const posts = await Post.find()
        return posts
      } catch (error) {
        throw new Error(err)
      }
    },
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId)

        if(post) {
          return post
        } else {
          throw new Error('Post not found')
        }

      } catch (error) {
        throw new Error(err)
      }
    }
  },

  Mutation: {
    createPost: async (_, { body }, context) => {
      // an error will be thrown from checkAuth function if there is no user
      const user = checkAuth(context)

      console.log(user)

      // if you reach this line of code, the user is logged in, and therefore they can create a post
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: Date.now()
      })

      const post = await newPost.save()

      return post
    }
  }

}
