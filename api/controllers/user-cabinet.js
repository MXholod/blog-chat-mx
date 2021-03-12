const { validationResult } = require('express-validator');
const { User } = require('./../helpers/db');
const createSalt = require("./../helpers/salt");
const { compare: comparePasswords } = require("./../helpers/salt");

/*function test(req, res,next){
  //console.log("Auth token ",req.headers.authorization," ",req.user);
  return res.status(200).json({ message: "Ok" });
}*/
async function updateUserLogin(req, res, next){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: "Your new login is incorrect"});
  }
  try{
    //Find ID in DB and then update user login
    const result = await User.findOneAndUpdate({_id: req.user.id},{$set:{ login: req.body.newLogin }},{new:true});
    return res.status(200).json({ message: "You've chaged your login", userName: result.login });
  }catch(e){
    return res.status(400).json({ message: "Error "+e.message});
  }
}

async function updateUserPassword(req,res,next){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg});
  }
  let user;
    try{
      //Find current user
      user = await User.findOne( { _id: req.user.id } );
      if(!user) throw new Error("Password is incorrect DB 1");
    }catch(e){
      return res.status(400).json({ message: e.message});
    }
    //Compare working password
    comparePasswords(req.body.workPass, user.passwordHash, function(error, matchResult){
      if(error){
        //throw new Error("Password is incorrect 3");
        return res.status(400).json({message: "Error Bad", passwordChanged: false});
      }
      if (!matchResult) {
        return res.status(400).json({message: "Match Bad", passwordChanged: false});
      }else{
        //If working password is correct then create new one based on the new password
        createSalt(req.body.pass, async function(hash){
          //
          try{
            //Find user by ID and update his password
            await User.findOneAndUpdate({_id: req.user.id},{$set:{ passwordHash: hash }},{new:true});
            return res.status(200).json({message: "Password was updated", passwordChanged: true});
          }catch(e){
            return res.status(400).json({message: "Match Bad", passwordChanged: false});
          }
        });
      }
    });
}

module.exports = {
  //test,
  updateUserLogin,
  updateUserPassword
};
