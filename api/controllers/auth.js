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
module.exports.createUser = async (request, response) => {
  const applicant = await User.findOne({ login: request.body.login })
  // If User with this login already exists
  if (applicant) {
    response.status(409).json({ message: "User login is busy" })
  } else {
    const salt = bcrypt().genSaltSync(10)
    // Create new User
    const user = new User({
      login: request.body.login,
      password: bcrypt.hashSync(request.body.pass, salt)
    })
    // Save user to Db
    await user.save()
    // Something successfully created
    response.status(201).json(user)
  }
}
