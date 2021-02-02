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

module.exports = generateRefreshToken;
