const { validationResult } = require('express-validator');
const createSalt = require('./../helpers/salt');
const { User } = require('./../helpers/db');
const crypto = require('./../helpers/crypto');
const { sendVerificationEmail } = require('./../helpers/send_email');

async function register(req, res, next){
  // console.log("Origin ",req.get('origin'));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Search an email field
    let errorsArr = errors.array();
    let errorStatus = false;
    for(let i = 0;i < errorsArr.length;i++){
      if(errorsArr[i].param === 'email' && errorsArr[i].msg.emailIsBusy){
          errorsArr[i].msg = errorsArr[i].msg.txt;
          errorStatus = true;
          break;
      }
    }
    if(errorStatus){
      // If User with this email already exists
      return res.status(409).json({ errors: errors.array() })
    }else{
      return res.status(400).json({ errors: errors.array() });
    }
  }else{//No errors detected. Create new User
    createSalt(req.body.password, async function(hash){
      //Create account object
      const user = new User({
        "login": req.body.login,
	      "email": req.body.email,
        "passwordHash": hash,
       	"acceptTerms": req.body.acceptTerms
      });

      user.verificationToken = crypto.randomTokenString();
      const isFirstUser = (await User.countDocuments({})) === 0;
        user.isAdmin = isFirstUser ? isFirstUser : false;
        user.role = isFirstUser ? 'admin' : 'user';

      // Save user account
      user.save( async err =>{
        if(err){
          return res.status(500).json({"message": "Access denied"});
        }
        try{
          //Send email
          await sendVerificationEmail(user, req.get('origin'));
        }catch(e){
          // Delete current User from DB if Email error is occured
          user.deleteOne({ email: req.body.email }).then(function(){
            console.log("Data deleted"); // Success
          }).catch(function(error){
            console.log(error); // Failure
          });
          return res.status(500).json({"message": "Email service access denied"});
        }
        // Something successfully created
        res.status(201).json({
          "message": "Registration successful, please check your email for verification instructions",
          "userInfo": user
        })
      });
    });
  }
}

module.exports = {
  register
}
