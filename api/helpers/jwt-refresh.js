const { JwtRefresh } = require('./../helpers/db');
const { randomTokenString } = require('./../helpers/crypto');

function generateRefreshToken(user, ipAddress) {
  JwtRefresh.deleteOne({ user: user.id }, function(err){
    if(err){
      throw new Error("Token refresh exception");
    }
  });
  // Create a refresh token that expires in 7 days
  return new JwtRefresh({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7*24*60*60*1000),
    createdByIp: ipAddress
  });
}

async function getRefreshToken(token, ipAddress) {
  //Get two objects from DB: 'refreshtokens' and 'users' merged by method 'populate()'
  const refreshToken = await JwtRefresh.findOne({ token }).populate('user');
  if (!refreshToken || refreshToken.isExpired){//!refreshToken.isActive
    //Save in the Database
    refreshToken.revoked = Date.now();
    refreshToken.revokedByIp = ipAddress;
    await refreshToken.save();
    throw 'Invalid token';
  }
  return refreshToken;
}

module.exports = {
  generateRefreshToken,
  getRefreshToken
};
