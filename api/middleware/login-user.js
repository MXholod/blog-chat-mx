const { body } = require('express-validator');

module.exports = ()=>{
  return [
    // email must be an email
    body('email').isEmail().withMessage('Email is incorrect'),
    // password must be at least 5 chars long
    body('password').isLength({ min: 5, max: 12 }).withMessage('Password is incorrect'),
  ];
}
