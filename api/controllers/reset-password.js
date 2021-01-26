const { validationResult } = require('express-validator');
const { User } = require('./../helpers/db');
const createSalt = require('./../helpers/salt');

//It uses in Nuxt Middleware
async function checkTokenPassword(req, res, next){
  const { token } = req.body;
  try{
    const isToken = await User.findOne({
      'resetToken.token': token,
      'resetToken.expires': { $gt: Date.now() }
    });
    if(isToken){
      res.status(200).json({ message: "Token is good", resetPassword: true });
    }else{
      res.status(403).json({ message: "Token is expired", resetPassword: false });
    }
  }catch(e){
    res.status(500).json({ message: "Sending data is incorrect", resetPassword: false });
  }
}

function resetPassword(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
          message: errors.array()[0].msg
        });
    }
    const { token, password } = req.body;
    createSalt(password, async function(hash){
      try{
          const user = await User.findOne({
            'resetToken.token': token,
            'resetToken.expires': { $gt: Date.now() }
          });

          if (!user) throw new Error('Restore password time has expired');

          // update password and remove reset token
          user.passwordHash = hash;
          user.passwordReset =  Date.now();
          user.resetToken = undefined;
          await user.save();
      }catch(e){
        //'Password couldn\'t be reset.
        return res.status(409).json({ message: e.message })
      }
        return res.status(200).json({ message: 'Password reset successful, you can now login' })
    });
}

module.exports = {
  checkTokenPassword,
  resetPassword
}
