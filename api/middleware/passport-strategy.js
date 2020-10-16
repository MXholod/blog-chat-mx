/* eslint-disable */
const { Strategy, ExtractJwt } = require('passport-jwt')
// const { model } = require('mongoose')
const keys = require('./../config/keys')
// Get 'users' collection
// const User = model('users')
const User = require('./../models/user')

const options = {
  // Send JWT from FrontEnd in Headers
  // fromAuthHeaderAsBearerToken() make a Header like: 
  // Authorization: Bearer ret34jkj5ljlj3
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.JWT
}

// Strategy description
module.exports = new Strategy(options, async (payload, done) => {
  try {
    const applicant = await User().findById(payload.userId).select('id')
    if (applicant) {
      done(null, applicant)
    } else {
      // Authorization for specific Route is restricted
      done(null, false)
    }
  } catch (e) {
    console.error(e)
  }
})
