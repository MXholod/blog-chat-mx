const bcrypt = require('bcrypt');
const saltRounds = 10;

//Salt a password. 1. Password 2. Function for DB
const genSalt = async (password, toDbWithSalt)=>{
    await bcrypt.genSalt(saltRounds, async function(err, salt) {
        await bcrypt.hash(password, salt, function(err, hash) {
            // Store hash in your password DB.
            toDbWithSalt(hash);
        });
    });
}
//Compare incoming password with a hash from DB
function compare(password, hash, callback){
    // Load hash from your password DB.
    bcrypt.compare(password, hash, function(err, result) {
        // result == true
        callback(err, result);
    });
}
//Synchronous password hashing
function genSaltSync(password){
    return bcrypt.hashSync(password, saltRounds);
}

module.exports = genSalt;
module.exports.compare = compare;
module.exports.genSaltSync = genSaltSync;

/* To check a password:
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
    // result == true
});
bcrypt.compare(someOtherPlaintextPassword, hash, function(err, result) {
    // result == false
});
*/
