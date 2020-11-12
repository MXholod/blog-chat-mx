/* eslint-disable */
const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  login: { type: String, required: true, unique: true },
  password: { type: String, required: true, minLength: 6 },
  avatar: { type: String, required: false },
  chatBan : { type: Boolean, default: false },
  inChat : { type: Boolean, default: false },
  blogBan : { type: Boolean, default: false },
  // If users aren't exist in a document sets the 'isAdmin' to true
  isAdmin : { type: Boolean, default: false },
  // role - 'admin' | 'moderator' | 'guest'
  role: { type: String, required: true },
  posts: [ { type: Schema.Types.ObjectId, ref: 'posts' } ],
  // Relationship with 'chat-rooms' - one-to-many
  rooms: [
    { type: Schema.Types.ObjectId, ref: 'chat-rooms' }
  ]
})

module.exports = model('users', userSchema)
