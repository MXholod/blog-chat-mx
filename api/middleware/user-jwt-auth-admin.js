const { Strategy, ExtractJwt } = require('passport-jwt');
const config = require('./../config/keys');

const { User } = require('./../helpers/db');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT,
    //Important, so that the verify function can accept the req param ie verify(req,payload,done)
    //passReqToCallback: true // 'req' can be used in (req, payload, done)=>{}
};

module.exports = new Strategy(options, async (payload, done)=>{
    try{
        // Get the User Role
        const user = await User.findById(payload.id);
        if((user && user.role === 'admin') || (user && user.role === 'moderator')){
          let userData = {
            id : user.id,
            //req.user.role
            role : user.role,
            //If refresh-token exists return 'true' else 'false'
            //ownsToken : token => !!refreshTokens.find(x => x.token === token)
          };
          // done() method will add 'user' object to the 'request' object as a property
          done(null, userData);
        }else{
          // account no longer exists or role not authorized, Authorization for specific Route is restricted
          // return res.status(401).json({ message: 'Unauthorized' });
          done(null, false);
        }
    }catch(e){
      console.error(e)
    }
});
