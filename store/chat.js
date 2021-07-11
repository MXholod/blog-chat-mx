/* eslint-disable */
export const state = () => ({
    user: {}, // name: userName, room: currentRoom, userSocketId: socket.id
    messages: [], // name: userName, text: messageText, userSocketId: socket.id
    systemMessage: {
      title: '',
      text: ''
    },
    //users - [{socketId: socket.id, name: userName, room: currentRoom}, {}, ...]
    users: [], // Array of all object users in the current room.
    currentRoom: null // Name of the current room
  })

  export const mutations = {
    addUser (state, user) {
      state.user = user
    },
    clearData (state) {
      state.user = {}
      state.messages = []
      state.users = []
      state.currentRoom = null
    },
    addCurrentRoom(state, room){
      state.currentRoom = room;
    },
    SOCKET_systemMessage (state, systemMessage) {
      state.systemMessage = systemMessage
    },
    // It will be called automatically by installed package 'vue-socket.io'
    SOCKET_newMessage (state, message) {
      state.messages.push(message)
    },
    SOCKET_updateUsers (state, users) {
      state.users = users
    }
  }

  /* export const actions = {
    // It will be called automatically by installed package 'vue-socket.io'
    SOCKET_newMessage (ctx, data) {
      console.log('Message recieved ', data)
    }
  } */
