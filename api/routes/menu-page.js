const { Router } = require('express');
const router = Router();
const { getMenuPages, createPage } = require('./../controllers/menu-page');

// '/api/menu_page/page'
router.get('/page', getMenuPages);
// '/api/menu_page/create'
router.post('/create', createPage);

module.exports = router;
