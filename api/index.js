const { app, http } = require('./api.socket')
// Parse incoming request bodies in a middleware before handlers, available under the req.body property
const bodyParser = require('body-parser')
// Mongoose for MongoDB
const mongoose = require('mongoose')
// Passport library for restricting Routes
const passport = require('passport')
const strategyPassport = require('./middleware/passport-strategy')
// Config keys
const keys = require('./config/keys')

// Require API routes
const auth = require('./routes/auth')
const post = require('./routes/post')
const comment = require('./routes/comment')

// mongoose.connect() returns Promise()
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
// Register Passport. If User failed a Route gets the 401 status
app.use(passport.initialize())
passport.use(strategyPassport)
// Register Body-Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// Import API Routes
app.use('/auth',auth)
app.use('/post',post)
app.use('/comment',comment)

// Export express app
module.exports = app

// Start standalone server if directly running  
// if (require.main === module) { 
  const port = process.env.PORT_API || 3001 
  if(parseInt(process.env.HTTP_SERVER_API_SOCKET) === 1){
      process.env.HTTP_SERVER_API_SOCKET = 0
      // Start socket server
      http.listen(port, () => {
        console.log(`API server listening on port ${port}`)
      })
  }
// } 
