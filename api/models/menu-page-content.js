const { model, Schema } = require('mongoose');

const MenuPageContentSchema = new Schema({
  title: { type: String, required: true },
  pageHeader: { type: String, required: true },
  headerBlockOne: { type: String, default: undefined },
  contentBlockOne: { type: String, default: undefined },
  headerBlockTwo: { type: String, default: undefined },
  contentBlockTwo: { type: String, default: undefined },
  headerBlockThree: { type: String, default: undefined },
  contentBlockThree: { type: String, default: undefined },
  singleImage: String,
  date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: [
    { type: Schema.Types.ObjectId, ref: 'User' }
  ]
  //page: { type: Schema.Types.ObjectId, ref: 'Menu-page' }
});

MenuPageContentSchema.virtual('isBlockOne').get(function () {
  if(this.headerBlockOne && this.contentBlockOne){
    return true; //If 'true' then 'Block one' can be shown on a page
  }
});
MenuPageContentSchema.virtual('isBlockTwo').get(function () {
  if(this.headerBlockTwo && this.contentBlockTwo){
    return true; //If 'true' then 'Block two' can be shown on a page
  }
});
MenuPageContentSchema.virtual('isBlockThree').get(function () {
  if(this.headerBlockThree && this.contentBlockThree){
    return true; //If 'true' then 'Block three' can be shown on a page
  }
});
//In DB it will be 'menu-page-contents'
module.exports = model('Menu-page-content',MenuPageContentSchema);
