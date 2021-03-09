const { validationResult } = require('express-validator');
const { User } = require('./../helpers/db');

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

module.exports = {
  //test,
  updateUserLogin
};
