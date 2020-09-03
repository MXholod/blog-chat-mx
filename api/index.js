const { app, http } = require('./api.socket')

// Require API routes
const users = require('./routes/users')
const test = require('./routes/test')

// Import API Routes
app.use(users)
app.use(test)

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

  
/*const express = require('express')

// Create express instance
const app = express()

// Require API routes
const users = require('./routes/users')
const test = require('./routes/test')

// Import API Routes
app.use(users)
app.use(test)

// Export express app
module.exports = app

// Start standalone server if directly running
if (require.main === module) {
  const port = process.env.PORT || 3001
  app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
  })
}*/
