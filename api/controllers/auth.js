const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')
const User = require('./../models/user')
const keys = require('./../config/keys')

module.exports.login = async (request, response) => {
  // Search for a User by his login
  const applicant = await User.findOne({ login: request.body.login })
    if (applicant) {
      // Compare passwords
      const passResult = bcrypt.compareSync(request.body.pass, applicant.password)
      // When password is correct
      if (passResult) {
        // Generate Token
        const token = jwt.sign({
          login: applicant.login,
          userId: applicant._id
        }, keys.JWT, { expiresIn: (60 * 60) })
        // Send token to a User
        response.status(200).json({ token })
      } else {
        response.status(401).json({ message: 'Password is incorrect' })
        // response.status(404).json({ message: 'User not found' })
      }

    } else {
      response.status(404).json({ message: 'User not found' })
    }
}
module.exports.createUser = (request, response) => {

}
