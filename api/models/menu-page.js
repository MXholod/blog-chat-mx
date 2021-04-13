const { model, Schema } = require('mongoose');

const menuPageSchema = new Schema({
  id: { type: String, required: true, unique: true },
  pageName: { type: String, required: true },
  reference: { type: String, required: true, unique: true },
  pageHidden: { type: Boolean, default: false },
  parent: { type: [ Number ], default: undefined },
  item: { type: [ Number ], required: true },
  pageContent: { type: Schema.Types.ObjectId, ref: 'Menu-page-content' }
});
//In DB it will be 'menu-pages'
module.exports = model('Menu-page', menuPageSchema);
