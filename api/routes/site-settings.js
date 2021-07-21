const { Router } = require('express');
const router = Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const upload = require('./../middleware/logo-upload');
const uploadOptimized = require('./../middleware/logo-upload-optimize');
const {
  getAllOptions, getLogo, updateLogo, deleteLogo, getSiteLogo
} = require('./../controllers/site-settings');

// /api/settings/admin/options/:jwt
router.get('/admin/options/:jwt', getAllOptions);
// /api/settings/admin/logo
router.get('/admin/logo', authCabinetAdmin, getLogo);
// /api/settings/admin/logo/update
router.patch('/admin/logo/update',
  authCabinetAdmin,
  upload.single('singleImage'),
  uploadOptimized,
  updateLogo
);
// /api/settings/admin/logo/delete
router.delete('/admin/logo/delete',authCabinetAdmin, deleteLogo);
// /api/settings/logo
router.get('/logo',getSiteLogo);

module.exports = router;
