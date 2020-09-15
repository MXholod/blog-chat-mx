// Application from Express
const app = require('express')()
// Create server based on Application
const httpServer = require('http').createServer(app)
// SocketIO based on HTTP server
const io = require('socket.io')(httpServer)

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
      // If validation is good
      callback({
        // Socket ID is to define the User on the front-end
        userId: socket.id
      })
      // 
      socket.emit('newMessage',{
        name: 'admin',
        text: `Hello ${dataUser.name}`
      })
      // Notify all the Usres except of the current that the User has joined the chat
      socket.broadcast.to(dataUser.room).emit('newMessage',{
        name: 'admin',
        text: `User ${dataUser.name} has entered to chat`
      })
    })
    
    socket.on('createMessage', (data)=>{
      setTimeout(()=>{
         socket.emit('newMessage', { text: data.text + ' SERVER' } )
      },1000)
    })
    /*
    // console.log("IO Connected")
    socket.emit('newMessage', { text: 'Hello from socket' } )
    // 
    socket.on('createMessage', (data)=>{
      setTimeout(()=>{
         socket.emit('newMessage', { text: data.text + ' SERVER' } )
      },1000)
    }) */
})

module.exports = {
    app,
    http: httpServer
}
