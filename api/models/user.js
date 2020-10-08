const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  }
})

module.exports = model('usres', userSchema)
