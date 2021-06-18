const { Router } = require('express');
const passport = require('passport');
const authCabinet = passport.authenticate('jwt-cabinet', {session: false});
const { createComment } = require('./../controllers/comment');
const router = Router();

// '/api/comment'
router.post('/', authCabinet, createComment);

module.exports = router;
