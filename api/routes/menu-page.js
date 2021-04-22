const { Router } = require('express');
const router = Router();
const validationParamPageContent = require('./../middleware/page-content');
const upload = require('./../middleware/file-uploads');
const uploadOptimized = require('./../middleware/file-uploads-optimized');
const { getMenuPages, getMenuPageContent, createPage } = require('./../controllers/menu-page');

// '/api/menu_page/page'
router.get('/page', getMenuPages);
// '/api/menu_page/page/:reference'
router.get('/page/:reference', validationParamPageContent(), getMenuPageContent);
// '/api/menu_page/create'
router.post('/create', upload.single('singleImage'), uploadOptimized, createPage);

module.exports = router;
