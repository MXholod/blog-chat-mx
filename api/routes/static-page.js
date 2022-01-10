const { Router } = require('express');
const router = Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const {
  getAllStaticPages,
  getStaticPage,
  createStaticPage,
  updateStaticPage,
  deleteStaticPage,
  getAllStaticPagesLimited
} = require('./../controllers/static-page');

// '/api/static_page/pages'
router.get('/pages', getAllStaticPages);
// '/api/static_page/pages/limited'
router.get('/pages/limited', getAllStaticPagesLimited);
// '/api/static_page/admin/pages'
router.get('/admin/pages', authCabinetAdmin, getAllStaticPages);
// '/api/static_page/page/:pageName'
router.get('/page/:pageName', getStaticPage);
// '/api/static_page/admin/page'
router.post('/admin/page', authCabinetAdmin, createStaticPage);
// '/api/static_page/admin/page'
router.put('/admin/page', authCabinetAdmin, updateStaticPage);
// '/api/static_page/admin/page'
router.delete('/admin/page', authCabinetAdmin, deleteStaticPage);

module.exports = router;
