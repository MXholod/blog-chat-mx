const { Schema, model } = require('mongoose');

const systemMessage = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  text: { type: String, required: true },
  date: {
    type: Date,
    // Date will be created with the Message
    default: Date.now
  },
  roomName: { type: String, required: true },
  userName: { type: String, required: true },
  userRole: { type: String, required: true }
});

module.exports = model('System-message', systemMessage);
