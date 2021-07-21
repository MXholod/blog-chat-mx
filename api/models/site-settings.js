const { Schema, model } = require('mongoose');

const schemaSiteSettings = new Schema({
  siteLogo: { type: String, default: '' },
  adminId: { type: String, required: true }
});


module.exports = model('Site-settings', schemaSiteSettings);
