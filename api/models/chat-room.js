/* eslint-disable */
const { Schema, model } = require('mongoose')

const chatRoomSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  /*
  // Relationship with 'users' - one-to-many
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  // Relationship with 'chat-messages' - many-to-many
  messages: [
    { type: Schema.Types.ObjectId, ref: 'Chat-message' }
  ]*/
})

module.exports = model('Chat-room', chatRoomSchema)
