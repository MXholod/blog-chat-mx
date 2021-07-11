/* eslint-disable */
const { Schema, model } = require('mongoose')

const chatMessageSchema = new Schema({
  userName: { type: String, required: true },
  text: { type: String, required: true },
  avatar: { type: String, default: '' },
  role: { type: String, default: '' },
  date: { type: Date, default: Date.now },
  divider: { type: Boolean, default: false },
  inset: { type: Boolean, default: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  room: { type: Schema.Types.ObjectId, ref: 'Chat-room' }
  /*
  // Relationship with 'chat-rooms' - many-to-many
  rooms: [
    { type: Schema.Types.ObjectId, ref: 'Chat-room' }
  ]*/
})

module.exports = model('Chat-message', chatMessageSchema)
