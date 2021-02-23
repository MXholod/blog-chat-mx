const { Router } = require('express');
const passport = require('passport');
const test = require('./../controllers/user-cabinet');
const authCabinet = passport.authenticate('jwt-cabinet', {session: false});
const router = Router();

// /api/cabinet/test
router.get('/test', authCabinet, test);

module.exports = router;
