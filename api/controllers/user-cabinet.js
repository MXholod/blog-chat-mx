const path = require('path');
const fs = require('fs');
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
            const user = await User.findOneAndUpdate({_id: req.user.id},{$set:{ passwordHash: hash }},{new:true});
            if(!user){
              throw new Error("User is absent");
            }
            return res.status(200).json({message: "Password was updated", passwordChanged: true});
          }catch(e){
            return res.status(400).json({message: e.message, passwordChanged: false});
          }
        });
      }
    });
}

async function updateUserAvatar(req, res){
  const id = req.user.id;
  //If an image is sent, its file name is checked
  let singleImage = '';
  if(req.file){
    singleImage = req.file.filename;
  }else{
    singleImage = '';
  }
  //Remove previous avatar image if it exists
  if(req.body.prevAvatar !== '' && singleImage !== ''){
    removeFile(req.body.prevAvatar);
  }

  if(!id){
    return res.status(400).json({ message: 'Avatar can\'t be updated' });
  }
  try{
    const result = await User.findByIdAndUpdate(id, { avatar: singleImage }, { new: true });
    if(result){
      return res.status(200).json({ message: 'Avatar has updated', avatar: result.avatar });
    }
  }catch(e){
    return res.status(400).json({ message: 'Avatar hasn\'t updated' });
  }
}

// Private function for deleting files
const removeFile = (file)=>{
  let filePath = path.resolve(__dirname, '../..','static','avatar',file);
  //Remove uploaded file from 'temp' directory
  if (!fs.existsSync(filePath)) {
    //console.log('The file does not exist');
    return;
  }
  //File will be removed
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = {
  //test,
  updateUserLogin,
  updateUserPassword,
  updateUserAvatar
};
