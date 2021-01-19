"use strict";
const nodemailer = require('nodemailer');
const config = require('./../config/keys');

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail({ to, subject, html }) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: config.EMAIL.service,
    host: config.EMAIL.host,
    port: config.EMAIL.port,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.EMAIL.user, // generated ethereal user
      pass: config.EMAIL.pass, // generated ethereal password
    },
    tls: {
      // But if you still believe that the mail services which you are trying to use have a valid certificates then you may have the local issue with the machine or the network.
      // do not fail on invalid certs
      rejectUnauthorized: false
    }
  });

  // send mail with defined transport object

  let info = await transporter.sendMail({
    from: config.EMAIL.from, // sender address
    to,
    subject,
    text: "Want to authenticate?", // plain text body
    html
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

// sendEmail().catch(console.error);

// Use it in Middleware
async function sendAlreadyRegisteredEmail(email, origin) {
  let message;
  if (origin) {
      message = `<p>If you don't know your password please visit the <a href="${origin}/account/forgot-password">forgot password</a> page.</p>`;
  } else {
      message = `<p>If you don't know your password you can reset it via the <code>/account/forgot-password</code> api route.</p>`;
  }

  await sendEmail({
      to: email,
      subject: 'Sign-up Verification API - Email Already Registered',
      html: `<h4>Email Already Registered</h4>
             <p>Your email <strong>${email}</strong> is already registered.</p>
             ${message}`
  });
}

// Use it in 'register' controller
async function sendVerificationEmail(user, origin) {
  let message;
  if (origin) {
      const verifyUrl = `${origin}/verification-email?token=${user.verificationToken}`;
      message = `<p>Please click the below link to verify your email address:</p>
                 <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
  } else {
      message = `<p>Please use the below token to verify your email address with the <code>/verification-email?token=here is a token from your email</code></p>
                 <p><code>${user.verificationToken}</code></p>`;
  }

  await sendEmail({
      to: user.email,
      subject: 'Sign-up Verification API - Verify Email',
      html: `<h4>Verify Email</h4>
             <p>Thanks for registering!</p>
             ${message}`
  });
}

// Use it in 'forgotPassword' controller
async function sendPasswordResetEmail(user, origin) {
  let message;
  if (origin) {
      const resetUrl = `${origin}/reset-password?token=${user.resetToken.token}`;
      message = `<p>Please click the below link to reset your password, the link will be valid for 1 day:</p>
                 <p><a href="${resetUrl}">${resetUrl}</a></p>`;
  } else {
      message = `<p>Please use the below token to reset your password with the <code>/reset-password</code> api route:</p>
                 <p><code>${user.resetToken.token}</code></p>`;
  }

  await sendEmail({
      to: user.email,
      subject: 'Sign-up Verification API - Reset Password',
      html: `<h4>Reset Password Email</h4>
             ${message}`
  });
}

module.exports = sendEmail;

module.exports.sendAlreadyRegisteredEmail = sendAlreadyRegisteredEmail;
module.exports.sendVerificationEmail = sendVerificationEmail;
module.exports.sendPasswordResetEmail = sendPasswordResetEmail;

