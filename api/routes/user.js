const { Router } = require('express');
const router = Router();
const validationRegistration = require('./../middleware/registration-user');
const { register } = require('./../controllers/register');
const { emailVerification } = require('./../controllers/email-verification');
const validationForgotPassword = require('./../middleware/forgot-password-user');
const { forgotPassword } = require('./../controllers/forgotPassword');

//First time registration '/api/user/registration'
router.post('/registration', validationRegistration(), register);
//Email verification
//'/api/user/verification'
router.post('/verification', (req,res,next)=>next(), emailVerification);
//'/api/user/forgot-password'
router.post('/forgot-password', validationForgotPassword(), forgotPassword);

module.exports = router
