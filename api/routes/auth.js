const { Router } = require('express');
const passport = require('passport');
const loginUser = require('./../middleware/login-user');
const { authenticate } = require('../controllers/auth');
const { refresh_token } = require('../controllers/jwt-refresh');
const router = Router();

// When work with Login Authorization in REST api use post() method
// REST API: get() - get data; post() - create data; put() - change/update data; delete() - delete data;
// /api/auth/user/login
router.post('/user/login', loginUser(), authenticate);
// '/api/auth/user/refresh'
router.post('/user/refresh', refresh_token);
// /api/auth/admin/create
/*router.post(
  '/admin/create',
  passport.authenticate('jwt', { session: false }),
  createUser
)*/

module.exports = router
