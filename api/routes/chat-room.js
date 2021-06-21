const { Router } = require('express');
const router = Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const authCabinet = passport.authenticate('jwt-cabinet', {session: false});
const { createRoom, getAllRooms } = require('./../controllers/chat-room');

// '/api/chat_room/create'
router.post('/create', authCabinetAdmin, createRoom);
// '/api/chat_room/rooms'
router.get('/rooms', authCabinet, getAllRooms);

module.exports = router;
