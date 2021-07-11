const express = require('express');
const router = express.Router();
const passport = require('passport');
const authCabinet = passport.authenticate('jwt-cabinet', {session: false});
const { getRoomMessages } = require('./../controllers/chat-message');

// '/api/chat_message/room/message/:room'
router.get('/room/message/:room', authCabinet, getRoomMessages);

module.exports = router;
