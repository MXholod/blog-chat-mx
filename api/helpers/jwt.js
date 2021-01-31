const jwt = require('jsonwebtoken');
const config = require('./../config/keys');

function generateJwtToken(user) {
    // create a jwt token containing the account id that expires in 15 minutes
    return jwt.sign(
        { sub: user.id, id: user.id },
        config.JWT,
        { expiresIn: '15m' }
    );
}

module.exports.generateJwtToken = generateJwtToken;
