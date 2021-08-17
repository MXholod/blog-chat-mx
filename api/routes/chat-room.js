const { Router } = require('express');
const router = Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const authCabinet = passport.authenticate('jwt-cabinet', {session: false});
const chatRoomValidation = require('./../middleware/chat-room-validation');
const {
  createRoom,
  getAllRooms,
  getAllRoomsWithMessages,
  deleteRoomWithMessages
 } = require('./../controllers/chat-room');

// '/api/chat_room/create'
router.post('/create', authCabinetAdmin, chatRoomValidation(), createRoom);
// '/api/chat_room/rooms'
router.get('/rooms', authCabinet, getAllRooms);
// '/api/chat_room/rooms_messages'
router.get('/rooms_messages', authCabinetAdmin, getAllRoomsWithMessages);
// '/api/chat_room/rooms_messages'
router.delete('/rooms_messages', authCabinetAdmin, deleteRoomWithMessages);

module.exports = router;
