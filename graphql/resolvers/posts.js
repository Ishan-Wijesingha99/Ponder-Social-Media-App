const Post = require('../../models/Post')


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
  }

}
