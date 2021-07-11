//app - express, http - httpServer
const { app, http } = require('./api.socket');
//Mongoose and MongoDB
const { connectDB } = require('./helpers/db');
// Parse incoming request bodies in a middleware before handlers, available under the req.body property
const bodyParser = require('body-parser');
// Parse cookies and add them to the Request object
const cookieParser = require('cookie-parser');
// Passport library for restricting Routes
const passport = require('passport');
const strategyJwtPassport = require('./middleware/user-jwt-auth');
const strategyJwtPassportAdmin = require('./middleware/user-jwt-auth-admin');
//CORS
const cors = require('cors');
app.use(cors());

// Require API routes
const auth = require('./routes/auth');
const user = require('./routes/user');
const post = require('./routes/post');
const comment = require('./routes/comment');
const cabinet = require('./routes/user-cabinet');
const menuPages = require('./routes/menu-page');
const chatRoom = require('./routes/chat-room');
const chatMessage = require('./routes/chat-message');

//Mongo connection
connectDB();
// Register Passport. If User failed a Route gets the 401 status
app.use(passport.initialize());
passport.use('jwt-cabinet',strategyJwtPassport);
passport.use('jwt-cabinet-admin',strategyJwtPassportAdmin);
// Register Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//Register Cookie-parser
app.use(cookieParser());

// Import API Routes
app.use('/auth',auth);
app.use('/user',user);
app.use('/post',post);
app.use('/comment',comment);
app.use('/cabinet',cabinet);
app.use('/menu_page', menuPages);
app.use('/chat_room', chatRoom);
app.use('/chat_message', chatMessage);

//Create server for Socket.IO
const port = process.env.PORT_API || 3001;
http.listen(port, () => {
  console.log(`API server listening on port`)
})

export default {
  // path: '/api',
  handler: app
}
