// Mongoose for MongoDB
const mongoose = require('mongoose');
const User = require('./../models/user');
const JwtRefresh = require('./../models/jwt-refresh');
const MenuPage = require('./../models/menu-page');
const MenuPageContent = require('./../models/menu-page-content');
const Post = require('./../models/post');
const Comment = require('./../models/comment');
const ChatRoom = require('./../models/chat-room');
const ChatMessage = require('./../models/chat-message');
const SiteSettings = require('./../models/site-settings');
const SystemMessage = require('./../models/system-message');
// Config keys
const keys = require('./../config/keys');

function connectDB(){
  //Mongoose. mongoose.connect() returns Promise()
  mongoose.connect(keys.MONGO_DB_URI, {
    'useCreateIndex': true,
    'useNewUrlParser': true ,
    'useFindAndModify': false,
    'useUnifiedTopology': true
  })
  .then(() => {
    console.log('MongoDB connected...')
  })
  .catch((error) => console.log('MongoDB error ', error))
}

//The function to check existing ID
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
  connectDB, //Make a DB connection
  User,
  JwtRefresh,
  MenuPage,
  MenuPageContent,
  Post,
  Comment,
  ChatRoom,
  ChatMessage,
  SiteSettings,
  SystemMessage,
  isValidId
};
