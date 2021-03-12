const { validationResult } = require('express-validator');
const { User } = require('./../helpers/db');
const { compare: comparePasswords } = require("./../helpers/salt");
const { generateJwtToken } = require('./../helpers/jwt');
const { generateRefreshToken } = require('./../helpers/jwt-refresh');
const basicDetails = require('./../helpers/basic-details');
const setTokenCookie = require('./../helpers/token-cookie');

async function authenticate(req, res, next){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  const { email, password } = req.body;
  const ipAddress = req.ip;
  try{
      const user = await User.findOne( { email } );
      if(!user) throw new Error("Email or password is incorrect");
      comparePasswords(password, user.passwordHash, async function(error, matchResult){
        try{
          if(error) throw new Error("Email or password is incorrect");
          if (!user || !user.isVerified || !matchResult) {
            throw new Error('Email or password is incorrect');
          }
          // authentication successful so generate jwt
          const jwtToken = generateJwtToken(user);
          // authentication successful so generate refresh token
          const refreshToken = generateRefreshToken(user, ipAddress);

          // save refresh token
          await refreshToken.save();

          // basic details and tokens
          const details = {
              ...basicDetails(user),
              jwtToken,
              refreshToken: refreshToken.token
          };
          setTokenCookie(res, refreshToken.token);
          res.status(200).json({ message: 'You are authenticated', details });
        }catch(e){
          return res.status(401).json({ msg: e.message, details: null });
        }
      });
  }catch(e){
    return res.status(401).json({ msg: e.message, details: null });
  }
}

module.exports = {
  authenticate
}
