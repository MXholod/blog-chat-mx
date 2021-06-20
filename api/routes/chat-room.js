const { Router } = require('express');
const router = Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const { createRoom } = require('./../controllers/chat-room');

// '/api/chat_room/create'
router.post('/create', authCabinetAdmin, createRoom);

module.exports = router;
