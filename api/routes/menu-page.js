const { Router } = require('express');
const router = Router();
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const validationParamPageContent = require('./../middleware/page-content');
const upload = require('./../middleware/file-uploads');
const uploadOptimized = require('./../middleware/file-uploads-optimized');
const { getMenuPages, getMenuPageContent, createPage, getFullPageContent } = require('./../controllers/menu-page');

// '/api/menu_page/page'
router.get('/page', getMenuPages);
// '/api/menu_page/page/:reference'
router.get('/page/:reference', validationParamPageContent(), getMenuPageContent);
// '/api/menu_page/create'
router.post('/create',authCabinetAdmin ,upload.single('singleImage'), uploadOptimized, createPage);
// '/api/menu_page/full_page/:reference'
router.get('/full_page/:reference', validationParamPageContent(), getFullPageContent);

module.exports = router;
