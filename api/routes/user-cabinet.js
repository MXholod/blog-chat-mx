const { Router } = require('express');
const passport = require('passport');
const authCabinet = passport.authenticate('jwt-cabinet', {session: false});
const userLoginMiddleware = require('./../middleware/update-user-login');
const {
  updateUserLogin,
  updateUserPassword,
  updateUserAvatar
} = require('./../controllers/user-cabinet');
const userPasswordMiddleware = require('./../middleware/update-user-password');
const upload = require('./../middleware/avatar-upload');
const uploadOptimized = require('./../middleware/avatar-upload-optimize');
const router = Router();

// /api/cabinet/user-name
router.put('/user-name', authCabinet, userLoginMiddleware(), updateUserLogin);
// /api/cabinet/user-password
router.put('/user-password', authCabinet, userPasswordMiddleware(), updateUserPassword);
// /api/cabinet/user-avatar/update
router.patch('/user-avatar/update',
  authCabinet,
  upload.single('singleImage'),
  uploadOptimized,
  updateUserAvatar);

module.exports = router;
