const { validationResult } = require('express-validator');
const jwtDecode = require('jwt-decode');
const { User, JwtRefresh } = require('./../helpers/db');
const { compare: comparePasswords } = require("./../helpers/salt");
const { generateJwtToken } = require('./../helpers/jwt');
const { generateRefreshToken } = require('./../helpers/jwt-refresh');
const basicDetails = require('./../helpers/basic-details');
const setTokenCookie = require('./../helpers/token-cookie');
const createSalt = require('./../helpers/salt');

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
          //For all users who are not registered by the administrator - user.registeredByAdmin is 'false'
          if (!user.registeredByAdmin) {
            if (!user || !user.isVerified || !matchResult) {
              throw new Error('Email or password is incorrect');
            }
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

function createUserByAdmin(req, res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  createSalt(req.body.password, async function(hash){
    //Create account object
    const user = new User({
      "login": req.body.login,
      "email": req.body.email,
      "passwordHash": hash,
      "acceptTerms": req.body.acceptTerms,
      "role": req.body.role,
      "registeredByAdmin": req.body.registeredByAdmin,
      "verified": req.body.verified
    });
    // Save user account
    try{
      await user.save();
      res.status(201).json({"message": "A new user has been created","userInfo": user});
    }catch(e){
      return res.status(500).json({"message": "Access denied"});
    }
  });
}

async function getAllUsers(req, res){
  const userId = req.user.id || '';
  try{
    const allUsers = await User.find({});
    if(allUsers){
      return res.status(200).json({ "message": "You've got all the users","users": [allUsers, userId] });
    }
    res.status(500).json({"message": "Access denied"});
  }catch(e){
    return res.status(500).json({"message": "Access denied"});
  }
}
//The private function for Blog and Chat ban controllers
async function setStatusBan(userId, docObject, res){
  if(!userId){
    return res.status(500).json({ "message": "Unknown user" });
  }
  try{
    const result = await User.findOneAndUpdate({_id: userId},{$set: docObject},{new:true});
    if(result){
      return res.status(200).json({ "message": "Success", result });
    }
  }catch(e){
    return res.status(500).json({ "message": "Access denied" });
  }
}

function setStatusBanBlog(req, res){
  const { blog, userId } = req.body;
  //Call the private function
  return setStatusBan(userId, { blogBan: blog }, res);
}

function setStatusBanChat(req, res){
  const { chat, userId } = req.body;
  //Call the private function
  return setStatusBan(userId, { chatBan: chat }, res);
}

async function getRole(req, res){
  if(!req.params.jwt) return res.status(400).json({ message: "Can't define a role", role: '' });
  const jwtDecoded = jwtDecode(req.params.jwt) || {};
  //Difine current time
  const currentTime = new Date().getTime() / 1000;
  const expired = jwtDecoded.exp || 0;
  //Access Token is valid
  if(currentTime < expired){
    try{
      const { role, avatar, chatBan } = await User.findById(jwtDecoded.id).exec();
      return res.status(200).json({ message: "Role by access ", role, avatar, id: jwtDecoded.id, chatBan });
    }catch(e){
      return res.status(400).json({ message: e.message, role: '' });
    }
  }else{//Checking Refresh Token lifetime
    //Get Cookie using 'cookieparser'
    const token = req.cookies.refreshToken;
    try{
      //Get two objects from DB: 'refreshtokens' and 'users' merged by method 'populate()'
      const refreshToken = await JwtRefresh.findOne({ token }).populate('user');
      let avatar = refreshToken.user.avatar ? refreshToken.user.avatar : '';
      if (!refreshToken || refreshToken.isExpired){//!refreshToken.isActive
        //Refresh Token is expired
        return res.status(200).json({ message: "Role is absent", role: '', sessionEnd: true, avatar, id: jwtDecoded.id });
      }
      return res.status(200).json({ message: "Role by refresh ", role: refreshToken.user.role, avatar, id: jwtDecoded.id, chatBan: refreshToken.user.chatBan });
    }catch(e){
      return res.status(400).json({ message: "Role error", role: '' });
    }
  }
}

module.exports = {
  authenticate,
  createUserByAdmin,
  getAllUsers,
  setStatusBanBlog,
  setStatusBanChat,
  getRole
}
