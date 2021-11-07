const express = require('express');
const router = express.Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const {
  getSidebarVisibility,
  changeSidebarVisibility
 } = require('./../controllers/sidebar');

// 'api/sidebar/admin/visibility'
router.get('/admin/visibility',authCabinetAdmin, getSidebarVisibility);
// 'api/sidebar/admin/visibility:state'
router.patch('/admin/visibility/:state',authCabinetAdmin, changeSidebarVisibility);

module.exports = router;
