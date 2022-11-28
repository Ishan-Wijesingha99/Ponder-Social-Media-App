
const Post = require('../../models/Post')

const checkAuth = require('../../utils/checkAuth')

const { UserInputError } = require('apollo-server')

module.exports = {
  Mutation: {
    createComment: async (_, { postId, body }, context) => {

      const user = checkAuth(context)

      if(body.trim() === '') throw new UserInputError('Empty comment', {
        errors: {
          body: 'Comment body must not be empty'
        }
      })

      const post = await Post.findById(postId)

      if(!post) throw new UserInputError('Post not found')

      post.comments.unshift({
        body,
        username: user.username,
        createdAt: Date.now()
      })

      await post.save()

      return post
    }
  }
}