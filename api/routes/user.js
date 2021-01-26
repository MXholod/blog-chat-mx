const { Router } = require('express');
const router = Router();
const validationRegistration = require('./../middleware/registration-user');
const { register } = require('./../controllers/register');
const { emailVerification } = require('./../controllers/email-verification');
const validationForgotPassword = require('./../middleware/forgot-password-user');
const { forgotPassword } = require('../controllers/forgot-password');
const validationResetPassword = require('./../middleware/reset-password-user');
const { checkTokenPassword, resetPassword } = require('./../controllers/reset-password');

//First time registration '/api/user/registration'
router.post('/registration', validationRegistration(), register);
//Email verification
//'/api/user/verification'
router.post('/verification', (req,res,next)=>next(), emailVerification);
//'/api/user/forgot-password'
router.post('/forgot-password', validationForgotPassword(), forgotPassword);
//'/api/user/check-reset-password' use in Nuxt Middleware
router.post('/check-reset-password', checkTokenPassword);
//'/api/user/reset-password'
router.put('/reset-password', validationResetPassword(), resetPassword);

module.exports = router
