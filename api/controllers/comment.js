const Comment = require('./../models/comment')
const Post = require('./../models/post')

module.exports.createComment = async (request, response) => {
  try {
    const { name, text, postId } = request.body
    const comment = new Comment({ name, text, postId })
    await comment.save()
    // Save Comment ID to the Post
    const post = await Post.findById(postId)
    // Add 'id' of the Comment to the Post array
    post.comments.push(comment._id)
    await post.save()
    response.status(201).json(comment)
  } catch (e) {
    response.status(500).json(e)
  }
}
