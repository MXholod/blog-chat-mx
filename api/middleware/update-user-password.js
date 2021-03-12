const { body } = require('express-validator');

module.exports = ()=>{
    //Expected parameters: workin password, password, confirmed password
    return [
        // Working password must be from 5 to 12 chars long
        body('workPass').custom( (value, { req })=>{
          if(value.length < 5 || req.body.workPass.length > 12){
            throw new Error('Password characters format is incorrect');
          }
          // Indicates the success of this synchronous custom validator
          return true;
        } ),
        // password must be at least 5 chars long
        body('pass').isLength({ min: 5, max: 12 }).withMessage('Characters from 5 to 12'),
        // password confirmation
        body('confirmedPass').custom( (value, { req })=>{
          if(value !== req.body.pass){
            throw new Error('Password confirmation does not match password');
          }
          // Indicates the success of this synchronous custom validator
          return true;
        } )
      ]
}
