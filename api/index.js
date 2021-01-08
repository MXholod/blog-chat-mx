//app - express, http - httpServer
const { app, http } = require('./api.socket');
//Mongoose and MongoDB
const { connectDB } = require('./helpers/db');
// Parse incoming request bodies in a middleware before handlers, available under the req.body property
const bodyParser = require('body-parser');
// Passport library for restricting Routes
const passport = require('passport');
const strategyPassport = require('./middleware/passport-strategy');
//CORS
const cors = require('cors');
app.use(cors());

// Require API routes
//const auth = require('./routes/auth');
const post = require('./routes/post');
const comment = require('./routes/comment');

//Mongo connection
connectDB();
// Register Passport. If User failed a Route gets the 401 status
//app.use(passport.initialize());
//passport.use(strategyPassport);
// Register Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Import API Routes
//app.use('/auth',auth);
app.use('/post',post);
app.use('/comment',comment);

//Create server for Socket.IO
const port = process.env.PORT_API || 3001;
http.listen(port, () => {
  console.log(`API server listening on port`)
})

export default {
  // path: '/api',
  handler: app
}
