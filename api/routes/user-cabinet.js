const { Router } = require('express');
const passport = require('passport');
//const test = require('./../controllers/user-cabinet');
const authCabinet = passport.authenticate('jwt-cabinet', {session: false});
const userLoginMiddleware = require('./../middleware/update-user-login');
const { updateUserLogin } = require('./../controllers/user-cabinet');
const router = Router();

// /api/cabinet/test
//router.get('/test', authCabinet, test);
// /api/cabinet/user-name
router.put('/user-name', authCabinet, userLoginMiddleware(), updateUserLogin);

module.exports = router;
