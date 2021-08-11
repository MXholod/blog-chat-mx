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
    currentRoom: null, // Name of the current room
    usersInRooms: []
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
    },
    resetUser(state){
      state.user = {};
    },
    SOCKET_userJoinedToRooms(state, usersInRooms){
      state.usersInRooms = usersInRooms;
    },
    SOCKET_userLeftToRooms(state, usersInRooms){
      state.usersInRooms = usersInRooms;
    }
  }

  export const actions = {
    SOCKET_userChatBanState({ commit, state }, data){
      //If the user id in state is equal to the incoming id
      if(data.id === state.user.userId){
        commit('resetUser');
        commit('auth/updateChatBan',data.banState ,{root: true});
        this.$router.push('/');
      }
    }
  }

  /* export const actions = {
    // It will be called automatically by installed package 'vue-socket.io'
    SOCKET_newMessage (ctx, data) {
      console.log('Message recieved ', data)
    }
  } */
