const { body } = require('express-validator');
const { User } = require('./../helpers/db');

module.exports = ()=>{
  return [
    // email must be an email
    body('email').isEmail().withMessage('Email is incorrect'),
    // email must be presented and verified in DB to send a temporary password
    body('email').custom(( value )=> {
      // If custom validator returns a promise, it must reject to indicate that the field is invalid.
      return User.findOne({ email: value, verified: { $exists: true } }).then(user => {
        if (!user) {
          return Promise.reject({message:'You should register or verify an email!', emailIsIncorrect:true});
        }
      });
    }),
  ];
};
