const Post = require('../../models/Post')

const checkAuth = require('../../utils/checkAuth')

const { AuthenticationError } = require('apollo-server')




module.exports = {

  Query: {
    getPosts: async () => {
      try {
        // if you don't specify anything in find(), it will fetch all the documents in Post model/collection
        // the .sort() at the end is to sort the posts so that the newest posts are shown first, by default you'll get the newest posts being added to the end, which you don't want
        const posts = await Post.find().sort({ createdAt: -1 })
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

      // if you reach this line of code, the user is logged in, and therefore they can create a post
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: Date.now()
      })

      const post = await newPost.save()

      return post
    },
    deletePost: async (_, { postId }, context) => {
      // check if user is logged in
      const user = checkAuth(context)

      try {
        
        // get the post the user is trying to delete from the Post model/collection
        const post = await Post.findById(postId)

        // you can only delete your own posts on social media, you can't delete someone else's posts, so check if the username of the user and the username on the post matches
        if(user.username === post.username) {
          // delete post
          await post.delete()
          // return string that indicates post was deleted
          return 'Post deleted successfully'
        } else {
          // throw an error that tells user you can't delete someone else's post
          throw new AuthenticationError('Action not allowed')
        }

      } catch (error) {
        throw new Error(error)
      }

    }
  }

}
