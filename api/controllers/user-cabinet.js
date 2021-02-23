function test(req, res,next){
  //console.log("Auth token ",req.headers.authorization," ",req.user);
  return res.status(200).json({ message: "Ok" });
}

module.exports = test;
