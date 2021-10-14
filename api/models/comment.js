const { Schema, model } = require('mongoose')

const commentSchema = new Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  postId: { type: Schema.Types.ObjectId, ref: 'posts' },
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

module.exports = model('Comment',commentSchema)
