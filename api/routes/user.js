const { Router } = require('express')
const router = Router()
const validationRegistration = require('./../middleware/registration-user');
const { register } = require('./../controllers/register');
const { emailVerification } = require('./../controllers/email-verification');

//First time registration '/api/user/registration'
router.post('/registration', validationRegistration(), register);
//Email verification
//'/api/user/verification'
router.post('/verification', (req,res,next)=>next(), emailVerification);

module.exports = router
