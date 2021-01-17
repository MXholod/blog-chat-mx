const { Router } = require('express')
const router = Router()
const validationRegistration = require('./../middleware/registration-user');
const { register } = require('./../controllers/register');

//First time registration
router.post('/registration', validationRegistration(), register);

module.exports = router
