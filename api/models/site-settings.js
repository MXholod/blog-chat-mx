const { Schema, model } = require('mongoose');

const schemaSiteSettings = new Schema({
  siteLogo: { type: String, default: '' },
  adminId: { type: String, required: true },
  sidebarVisibility: { type: Boolean, default: true },
  popularPostsLimit: { type: Number, default: 0 },
  popularPostsVisibility: { type: Boolean, default: true },
  popularPagesLimit: { type: Number, default: 0 },
  popularPagesVisibility: { type: Boolean, default: true },
  recentlyCreatedPostsLimit: { type: Number, default: 0 },
  recentlyCreatedPostsVisibility: { type: Boolean, default: true },
  recentlyCreatedPagesLimit: { type: Number, default: 0 },
  recentlyCreatedPagesVisibility: { type: Boolean, default: true },
  searchVisibility: { type: Boolean, default: true },
  searchByPosts: { type: Boolean, default: true },
  searchByPages: { type: Boolean, default: true }
});


module.exports = model('Site-settings', schemaSiteSettings);
