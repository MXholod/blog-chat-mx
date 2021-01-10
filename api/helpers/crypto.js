let crypto;

try {
  crypto = require('crypto');
  //console.log('crypto supports!');
} catch (err) {
  //console.log('crypto support is disabled!');
  throw new Error(err);
}

function randomTokenString() {
  if(!crypto) return 'Crypto isn\'t supported';
  return crypto.randomBytes(40).toString('hex');
}

module.exports = {
  randomTokenString
}
