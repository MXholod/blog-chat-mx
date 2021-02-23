const { generateRefreshToken, getRefreshToken } = require('./../helpers/jwt-refresh');
const { generateJwtToken } = require('./../helpers/jwt');
const setTokenCookie = require('./../helpers/token-cookie');
//const basicDetails = require('./../helpers/basic-details');

async function refresh_token(req, res, next){
    //Get Cookie using 'cookieparser'
    const token = req.cookies.refreshToken;
    const ipAddress = req.ip;
    try{
        //Get RefreshToken Model merged with Accounts Model
        const refreshToken = await getRefreshToken(token, ipAddress);
        const { user } = refreshToken;
        //Create new Refresh Token. Replace old refresh token with a new one and save
        const newRefreshToken = generateRefreshToken(user, ipAddress);
          newRefreshToken.replacedByToken = refreshToken.token;//Old token
          //Update new refresh token in DB
        await newRefreshToken.save();
        //Create new Access Token
        const jwtToken = generateJwtToken(user);
        //Return basic details and tokens
        const details =  {
            //...basicDetails(user),
            jwtToken,
            //refreshToken: newRefreshToken.token
        };
        //Set Refresh token to a cookie
        setTokenCookie(res, newRefreshToken.token);
        return res.status(200).json({ details });
    }catch(e){
      return res.status(401).json({ message: e });
    }
}

module.exports = {
  refresh_token
};
