// Application from Express
const app = require('express')()
// Create server based on Application
const httpServer = require('http').createServer(app)
// SocketIO based on HTTP server
const io = require('socket.io')(httpServer)
//
const users = require('./Users')()
const { User, ChatMessage } = require('./helpers/db');

const userPresenceInChat = async (id, isInChat)=>{
  //If user is in chat - true, if he left chat - false
  try{
    await User.findByIdAndUpdate(id, { inChat: isInChat });
  }catch(e){
    console.log(e);
  }
}

io.on('connection', socket => {
  /* When the user first came (create new User) */
    // 1. dataUser - user Object; 2. callback - sends data to front-end
    socket.on('userJoined', (dataUser, callback) => {
      // If validation is bad
      if (!dataUser.name || !dataUser.room) {
        // Sends to front-end
        return callback('Entered data is incorrect!')
      }
      //Before the user join to a room
      const doesUserLeftRoom = users.users.find((el, ind, arr)=>{
        if(dataUser.userId === el.userId && el.room !== dataUser.room) {
          return true;
        }
      })
      //Disconnect the user from another room
      if(doesUserLeftRoom){
        const { name, room, userId } = doesUserLeftRoom;
        //Remove user from users array
        users.remove(userId);
        // Update list of all users in the room
        io.to(room).emit('updateUsers', users.users) //users.getByRoom(room));
        io.to(room).emit('systemMessage',{
          title: '-- User left --',
          text: `User ${name} left the chat`
        });
      }
      // Add User to a Room programmatically (id Room)
      socket.join(dataUser.room)
      //Remove user id before adding to avoid duplications
      users.remove(dataUser.userId)
      // Add a user to the class Users
      users.add({
        userId: dataUser.userId,
        name: dataUser.name,
        room: dataUser.room,
        socketId: socket.id
      })
      // If validation is good
      callback({
        // Socket ID is to define the User on the front-end
        userId: dataUser.userId
      })
      // Update list of all users in the room
      io.to(dataUser.room).emit('updateUsers', users.users) //users.getByRoom(dataUser.room))
      // System message
      socket.emit('systemMessage',{
        title: '-- New guest --',
        text: `Welcome to the chat ${dataUser.name}`
      })
      // Notify all the Usres except of the current that the User has joined the chat
      //socket.broadcast.to(dataUser.room).emit('systemMessage',{
      io.to(dataUser.room).emit('systemMessage',{
        title: '-- New guest has joined --',
        text: `User ${dataUser.name} has joined to the chat`
      })
      //Update 'inChat' user property in DB
      userPresenceInChat(dataUser.userId, true);
    })
    // Create a new chat event and send a message to all the users in the room
    // and even for the current user.
    socket.on('createMessage', (data, callback)=>{
      if (!data.text) {
        return callback('A message can\'t be empty')
      }
      //
      const currentUser = users.get(data.userId)
      if (currentUser) {
        //Save current message into the DB
        ChatMessage.create({
          text: data.text,
          user: data.userId,
          room: data.roomId,
          userName: currentUser.name,
          avatar: data.avatar,
          role: data.role
        }, function (err,success) {
          if(err){
              //console.log("Error ",err);
            }else{
              const { _id, userName: name, user, room, date, text, inset, divider, avatar, role } = success;
                //name = data.role === 'admin' ? `${name} (admin) ` : name;
              const newMessage = { _id, name, user, room, date, text, inset, divider, avatar, role };
              // to( 'room number' ) - which room a message is being sent to.
              // Event for all users in a specific room
              io.to(currentUser.room).emit('newMessage', newMessage);
            }
        });
        // Call the callback() to clean the form text field
        callback()
      }
    })
    // User left the chat
    socket.on('userLeft', (userId, callback) => {
      const user = users.remove(userId)
      if (user) {
        // Update list of all users in the room
        io.to(user.room).emit('updateUsers',users.users) //users.getByRoom(dataUser.room))
        io.to(user.room).emit('systemMessage',{
          title: '-- User left --',
          text: `User ${user.name} left the chat`
        })
      }
      callback()
      //Update 'inChat' user property in DB
      userPresenceInChat(userId, false);
    })
    // User closed the chat window
    socket.on('disconnect', () => {
      //Remove current user from the chat when he close browser tab or window
      const user = users.removeBySocketId(socket.id);
      if (user) {
        // Update list of all users in the room
        io.to(user.room).emit('updateUsers', users.users) //users.getByRoom(dataUser.room))
        io.to(user.room).emit('systemMessage',{
          title: '-- User left --',
          text: `User ${user.name} left the chat`
        })
        //Update 'inChat' user property in DB
        userPresenceInChat(user.userId, false);
      }
    })
    //Chat ban by Admin or Moderator
    socket.on('userChatBan', (dataUser, callback) => {
      if(!dataUser.id){
        // Sends to front-end
        return callback('Data to change chatBan is incorrect!')
      }
      // If data is correct
      callback({
        // Socket ID is to define the User on the front-end
        id: dataUser.id
      })
      //If user in the chat then ban him
      const userObj = users.get(dataUser.id);
      if(userObj){
        //
        const user = users.remove(dataUser.id);
        // Update list of all users in the room
        io.to(user.room).emit('updateUsers',users.users) //users.getByRoom(dataUser.room))
        io.to(user.room).emit('systemMessage',{
          title: '-- User left --',
          text: `User ${user.name} has been banned in the chat`
        });
        //Ban state in the specified room
        io.to(userObj.room).emit('userChatBanState', dataUser);
      }
      //Update 'inChat' user property in DB
      userPresenceInChat(dataUser.id, false);
    });

})

module.exports = {
    app,
    http: httpServer
}
