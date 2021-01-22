const { validationResult } = require('express-validator');
const { User } = require('./../helpers/db');
const { sendPasswordResetEmail } = require('./../helpers/send_email');
const { randomTokenString } = require('./../helpers/crypto');

async function forgotPassword(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {// If errors
      let errorsArr = errors.array();
      let errorStatus = false;
      for(let i = 0;i < errorsArr.length;i++){
        if(errorsArr[i].msg.emailIsIncorrect){// Email is absent in DB
            errorsArr[i].msg = errorsArr[i].msg.message;
            errorStatus = true;
            break;
        }
      }
      if(errorStatus){// If User Email doesn't exist in DB
        return res.status(400).json({ errors: errors.array() })
      }else{
        return res.status(400).json({ errors: errors.array() });
      }
    }else{//No errors detected. Generate new password
      const { email } = req.body;
      try{
        const user = await User.findOne({ email });
        // always return ok response to prevent email enumeration
        if (!user) throw new Error('User is absent');
        // Create reset token that expires after 24 hours
        user.resetToken = {
            token: randomTokenString().slice(0,15),
            expires: new Date(Date.now() + 24*60*60*1000)
        };
        await user.save();

        // send email
        await sendPasswordResetEmail(user, req.get('origin'));

        res.status(200).json({message: 'New password was generated'});
      }catch(e){
        res.status(400).json({message: `Can\'t generate password ${e.message}`});
      }
    }
}

module.exports = {
  forgotPassword
}
