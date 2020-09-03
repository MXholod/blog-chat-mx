// Application from Express
const app = require('express')()
// Create server based on Application
const httpServer = require('http').createServer(app)
// SocketIO based on HTTP server
const io = require('socket.io')(httpServer)

io.on('connection', socket => {
    // console.log("IO Connected")
    socket.emit('newMessage', { text: 'Hello from socket' } )
    // 
    socket.on('createMessage', (data)=>{
      setTimeout(()=>{
        socket.emit('newMessage', { text: data.text + ' SERVER' } )
      },1000)
    })
})

module.exports = {
    app,
    http: httpServer
}
