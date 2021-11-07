const express = require('express');
const router = express.Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const {
  getSidebarVisibility,
  changeSidebarVisibility
 } = require('./../controllers/sidebar');

// 'api/sidebar/visibility'
router.get('/visibility',authCabinetAdmin, getSidebarVisibility);
// 'api/sidebar/visibility:state'
router.patch('/visibility/:state',authCabinetAdmin, changeSidebarVisibility);

module.exports = router;
