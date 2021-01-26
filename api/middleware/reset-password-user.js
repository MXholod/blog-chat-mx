const { body } = require('express-validator');

function validationResetPassword(){
    return [
        // Token length max 15
        body('token').isLength({ max: 15 }).withMessage('Password update time is up'),
        // Token - allowed characters
        body('token').custom( (value)=>{
          const reg = /^[A-Za-z0-9]{15}$/g;
          if(!reg.test(value)){
            throw new Error('Password can\'t be refreshed');
          }
          // Indicates the success of this synchronous custom validator
          return true;
        }),
        // password must be at least 5 chars long
        body('password').isLength({ min: 5, max: 12 }).withMessage('Characters of the password must be from 5 to 12'),
        // password confirmation
        body('confirmPassword').custom( (value, { req })=>{
          if(value !== req.body.password){
            throw new Error('Password confirmation does not match password');
          }
          // Indicates the success of this synchronous custom validator
          return true;
        } ),
    ];
}

module.exports = validationResetPassword;
