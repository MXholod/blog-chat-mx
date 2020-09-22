export const state = () => ({
  user: {},
  messages: [],
  systemMessage: {
    title: '',
    text: ''
  },
  users: []
})

export const mutations = {
  addUser (state, user) {
    state.user = user
  },
  clearData (state) {
    state.user = {}
    state.messages = []
    state.users = []
  },
  SOCKET_systemMessage (state, systemMessage) {
    state.systemMessage = systemMessage
  },
  // It will be called automatically by installed package 'vue-socket.io'
  SOCKET_newMessage (state, message) {
    message.avatar = 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
    message.divider = true
    message.inset = true
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
