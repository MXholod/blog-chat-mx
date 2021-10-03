const express = require('express');
const router = express.Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const {
  allSystemMessages,
  deleteSystemMessage
} = require('./../controllers/chat-system-messages');


// '/api/chat_system/messages'
router.get('/messages', authCabinetAdmin, allSystemMessages);
// '/api/chat_system/message'
router.delete('/message', authCabinetAdmin, deleteSystemMessage);

module.exports = router;
