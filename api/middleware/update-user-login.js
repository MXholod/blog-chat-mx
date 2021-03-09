const { body } = require('express-validator');

module.exports = ()=>{
  //Expected parameters: newLogin (login)
  return [
    // newLogin (login) must be at least 15 chars long
    body('newLogin').isLength({ min: 3, max: 15 }).withMessage('Characters from 3 to 15')
  ]
}
