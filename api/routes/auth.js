const { Router } = require('express');
const passport = require('passport');
const loginUser = require('./../middleware/login-user');
const { authenticate } = require('../controllers/auth');
const router = Router();

// When work with Login Authorization in REST api use post() method
// REST API: get() - get data; post() - create data; put() - change/update data; delete() - delete data;
// /api/auth/user/login
router.post('/user/login', loginUser(), authenticate);

// /api/auth/admin/create
/*router.post(
  '/admin/create',
  passport.authenticate('jwt', { session: false }),
  createUser
)*/

module.exports = router
