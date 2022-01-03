const { model, Schema } = require('mongoose');

const StaticPage = new Schema({
  name: { type: String, unique: true, required: true },
  header: { type: String, required: true },
  text: { type: String }
});

//In DB it will be 'static-pages'
module.exports = model('Static-page', StaticPage);
