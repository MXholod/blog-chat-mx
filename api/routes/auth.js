const { Router } = require('express')
const { login, createUser } = require('../controllers/auth')
const router = Router()

// When work with Login Authorization in REST api use post() method
// REST API: get() - get data; post() - create data; put() - change/update data; delete() - delete data;
// /api/auth/admin/login
router.post('/admin/login', login)
// /api/auth/admin/create
router.post('/admin/create', createUser)

module.exports = router
