const { body } = require('express-validator');
const { User } = require('./../helpers/db');
const { sendAlreadyRegisteredEmail } = require('./../helpers/send_email');

module.exports = ()=>{
    //Expected parameters: login, email, password, passwordConfirmation, acceptTerms
    return [
        // login must be at least 5 chars long
        body('login').isLength({ min: 3, max: 15 }).withMessage('Characters from 3 to 15'),
        // email must be an email
        body('email').isEmail().withMessage('Email is incorrect'),
        // password must be at least 5 chars long
        body('password').isLength({ min: 5, max: 12 }).withMessage('Characters from 5 to 12'),
        // password confirmation
        body('passwordConfirmation').custom( (value, { req })=>{
          if(value !== req.body.password){
            throw new Error('Password confirmation does not match password');
          }
          // Indicates the success of this synchronous custom validator
          return true;
        } ),
        body('email').custom((value, { req } )=> {
          // If custom validator returns a promise, it must reject to indicate that the field is invalid.
          return User.findOne({ email: value }).then(user => {
            if (user) {
              const origin = req.get('origin');
              const { email } = req.body;
              sendAlreadyRegisteredEmail(email, origin);
              return Promise.reject({message:'E-mail already in use', emailIsBusy:true});
            }
          });
        }),
        // acceptTerms must be 'true'
        body('acceptTerms').custom( (value, { req })=>{
          if(!value){
            throw new Error('Terms must be accepted');
          }
          // Indicates the success of this synchronous custom validator
          return true;
        })
      ]
}
