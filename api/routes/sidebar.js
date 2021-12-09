const express = require('express');
const router = express.Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const {
  getSidebarSettings,
  changeSidebarVisibility,
  displaySidebar,
  getPopularPosts,
  getPopularPages,
  getRecentlyCreatedPosts,
  getRecentlyCreatedPages,
  updateBlockSettings,
  searching
 } = require('./../controllers/sidebar');

// 'api/sidebar/admin/settings'
router.get('/admin/settings',authCabinetAdmin, getSidebarSettings);
// 'api/sidebar/admin/visibility:state'
router.patch('/admin/visibility/:state',authCabinetAdmin, changeSidebarVisibility);
// 'api/sidebar/visibility'
router.get('/visibility', displaySidebar);
// 'api/sidebar/posts/popular_posts'
router.get('/admin/posts/popular_posts',authCabinetAdmin, getPopularPosts);
// 'api/sidebar/posts/popular_pages'
router.get('/admin/pages/popular_pages',authCabinetAdmin, getPopularPages);
// 'api/sidebar/posts/recent_posts'
router.get('/admin/posts/recent_posts',authCabinetAdmin, getRecentlyCreatedPosts);
// 'api/sidebar/posts/recent_pages'
router.get('/admin/pages/recent_pages',authCabinetAdmin, getRecentlyCreatedPages);
// 'api/sidebar/admin/block'
router.put('/admin/block',authCabinetAdmin, updateBlockSettings);
// 'api/sidebar/search/:searchstring'
router.get('/search/:searchstring', searching);

module.exports = router;
