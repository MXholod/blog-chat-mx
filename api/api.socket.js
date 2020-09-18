// Application from Express
const app = require('express')()
// Create server based on Application
const httpServer = require('http').createServer(app)
// SocketIO based on HTTP server
const io = require('socket.io')(httpServer)
//
const users = require('./Users')()

io.on('connection', socket => {
  /* When the user first came (create new User) */
    // 1. dataUser - user Object; 2. callback - sends data to front-end
    socket.on('userJoined', (dataUser, callback) => {
      // If validation is bad
      if (!dataUser.name || !dataUser.room) {
        // Sends to front-end
        return callback('Entered data is incorrect!')
      }
      // Add User to a Room programmatically (id Room)
      socket.join(dataUser.room)
      // Add a user to the class Users but remove before
      users.remove(socket.id)
      users.add({
        id: socket.id,
        name: dataUser.name,
        room: dataUser.room
      })
      // If validation is good
      callback({
        // Socket ID is to define the User on the front-end
        userId: socket.id
      })
      // System message
      socket.emit('systemMessage',{
        title: '-- New guest --',
        text: `Welcome to the chat ${dataUser.name}`
      })
      // Notify all the Usres except of the current that the User has joined the chat
      socket.broadcast.to(dataUser.room).emit('systemMessage',{
        title: '-- New guest has joined --',
        text: `User ${dataUser.name} has joined to the chat`
      })
    })
    // Create a new chat event and send a message to all the users in the room
    // and even for the current user.
    socket.on('createMessage', (data, callback)=>{
      if (!data.text) {
        return callback('A message can\'t be empty')
      }
      //
      const user = users.get(data.id)
      if (user) {
        // to( 'room number' ) - which room a message is being sent to.
        // Event for all users in a specific room
        io.to(user.room).emit('newMessage', {
          id: data.id,
          name: user.name,
          text: data.text
        }) 
        // Call the callback() to clean the form text field 
        callback()
      }
    })
})

module.exports = {
    app,
    http: httpServer
}
