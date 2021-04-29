const { Router } = require('express');
const passport = require('passport');
const authCabinetAdmin = passport.authenticate('jwt-cabinet-admin', {session: false});
const loginUser = require('./../middleware/login-user');
const userAdminCreation = require('./../middleware/user-admin-creation');
const { authenticate, createUserByAdmin, getAllUsers } = require('../controllers/auth');
const { refresh_token } = require('../controllers/jwt-refresh');
const router = Router();

// When work with Login Authorization in REST api use post() method
// REST API: get() - get data; post() - create data; put() - change/update data; delete() - delete data;
// /api/auth/user/login
router.post('/user/login', loginUser(), authenticate);
// '/api/auth/user/refresh'
router.post('/user/refresh', refresh_token);
// /api/auth/admin/user/create
router.post('/admin/user/create', authCabinetAdmin, userAdminCreation(), createUserByAdmin);
// /api/auth/admin/users
router.get('/admin/users', authCabinetAdmin, getAllUsers);

module.exports = router;
