const { User } = require('./../helpers/db');

async function emailVerification(req, res, next){
    const { token } = req.body;
    //const { token } = req.params;
    const tokenCheck = cryptoTokenValidate(token);
    if(!tokenCheck){
      return res.status(400).json({message: 'Unable to check token, it\'s spoiled'});
    }
    try{
        const user = await User.findOne({ verificationToken: token });
        if (!user) throw new Error('Unable to check token, it has expired');

        user.verified = Date.now();
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({message: 'Verification successful, you can now login'});
    }catch(e){
      res.status(400).json({message: e.message });
    }
}

function cryptoTokenValidate(token){
	//If String
	if(typeof(token) === 'string'){
		//Cut spaces
		token = token.trim();
		let reg = /^[A-Za-z0-9]+$/g;
		return reg.test(token);
	}else{
		return false;
	}
}

module.exports = {
  emailVerification
};
